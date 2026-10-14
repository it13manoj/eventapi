require('dotenv').config();
const sequelize = require('../db/conenction');
const { QueryTypes } = require('sequelize');

async function calculateInventoryAvailability() {
  // 1. Fetch all inventories with categories, subcategories, warehouses, sizes
  const [inventories] = await sequelize.query(`
    SELECT 
      i.id, i.categories_id, i.sub_categories_id, i.quantity, i.good, i.bad, i.missing, i.price,
      i.have_size, i.vertical_enabled, i.horizontal_enabled,
      c.name as category_name,
      sc.name as subcategory_name,
      w.name as warehouse_name
    FROM inventories i
    LEFT JOIN categories c ON c.id = i.categories_id
    LEFT JOIN subcategories sc ON sc.id = i.sub_categories_id
    LEFT JOIN ware_houses w ON w.id = i.ware_house_id
    ORDER BY i.id DESC
  `);

  const [verticalSizes] = await sequelize.query(`
    SELECT id, inventory_id, size, quantity, unit FROM inventory_vertical_sizes
  `);

  const [horizontalSizes] = await sequelize.query(`
    SELECT id, inventory_id, size, quantity, unit FROM inventory_horizontal_sizes
  `);

  // Group sizes by inventory_id
  const vMap = {};
  verticalSizes.forEach(v => {
    if (!vMap[v.inventory_id]) vMap[v.inventory_id] = [];
    vMap[v.inventory_id].push({ ...v, allocated_qty: 0, available_qty: Number(v.quantity) });
  });

  const hMap = {};
  horizontalSizes.forEach(h => {
    if (!hMap[h.inventory_id]) hMap[h.inventory_id] = [];
    hMap[h.inventory_id].push({ ...h, allocated_qty: 0, available_qty: Number(h.quantity) });
  });

  // 2. Fetch all booked items from uncompleted events
  const [activeBooked] = await sequelize.query(`
    SELECT 
      be.id, be.event_id, be.categories_id, be.subCategories_id, be.qt,
      be.vertical, be.verticalValue, be.verticalPcs,
      be.horizontal, be.horizontalValue, be.horizontalPcs,
      be.stock_id, be.st_qt,
      e.c_name as event_name, e.status as event_status, e.template_id, e.template_name
    FROM booked_events be
    JOIN events e ON e.id = be.event_id
    WHERE e.status NOT IN ('3', '4', 'Finished', 'Event Finished', 'Complete', 'Completed', 'Cancelled', 'Cancelled/Postpone')
  `);

  // Helper to extract numbers from size strings: e.g. "10ft" -> "10", "4" -> "4"
  const cleanSize = (val) => String(val || '').replace(/[^\d.]/g, '').trim();

  // 3. For each inventory, calculate allocated and available quantities
  const result = inventories.map(inv => {
    const vSizes = vMap[inv.id] ? [...vMap[inv.id]] : [];
    const hSizes = hMap[inv.id] ? [...hMap[inv.id]] : [];

    let totalQty = Number(inv.quantity || 0);
    if (inv.have_size) {
      const vTotal = vSizes.reduce((sum, s) => sum + Number(s.quantity || 0), 0);
      const hTotal = hSizes.reduce((sum, s) => sum + Number(s.quantity || 0), 0);
      totalQty = vTotal + hTotal;
    }

    let allocatedQty = 0;
    const matchedBookings = [];

    // Find all active booked rows for this inventory
    activeBooked.forEach(be => {
      let isMatch = false;

      // Check stock_id first
      let parsedStockIds = [];
      try {
        if (be.stock_id) {
          parsedStockIds = typeof be.stock_id === 'string' ? JSON.parse(be.stock_id) : be.stock_id;
          if (!Array.isArray(parsedStockIds)) parsedStockIds = [parsedStockIds];
        }
      } catch (e) {}

      if (parsedStockIds.includes(inv.id) || parsedStockIds.includes(String(inv.id))) {
        isMatch = true;
      } else if (
        Number(be.categories_id) === Number(inv.categories_id) &&
        Number(be.subCategories_id) === Number(inv.sub_categories_id)
      ) {
        // If categories and subcategories match, and either no specific stock_id or matched
        isMatch = true;
      }

      if (isMatch) {
        let allocatedForThisRow = 0;

        if (inv.have_size) {
          // If vertical size
          if (be.vertical && be.verticalValue) {
            const cleanVal = cleanSize(be.verticalValue);
            const vSize = vSizes.find(s => cleanSize(s.size) === cleanVal);
            if (vSize) {
              const pcs = Number(be.verticalPcs || 0);
              vSize.allocated_qty = (vSize.allocated_qty || 0) + pcs;
              vSize.available_qty = Math.max(0, Number(vSize.quantity) - vSize.allocated_qty);
              allocatedForThisRow += pcs;
            }
          }

          // If horizontal size
          if (be.horizontal && be.horizontalValue) {
            const cleanVal = cleanSize(be.horizontalValue);
            const hSize = hSizes.find(s => cleanSize(s.size) === cleanVal);
            if (hSize) {
              const pcs = Number(be.horizontalPcs || 0);
              hSize.allocated_qty = (hSize.allocated_qty || 0) + pcs;
              hSize.available_qty = Math.max(0, Number(hSize.quantity) - hSize.allocated_qty);
              allocatedForThisRow += pcs;
            }
          }

          // If size wasn't matched but qt or verticalPcs/horizontalPcs exists
          if (allocatedForThisRow === 0) {
            const pcs = Number(be.verticalPcs || be.horizontalPcs || be.qt || 0);
            allocatedForThisRow = pcs;
          }
        } else {
          // Simple item without sizes
          allocatedForThisRow = Number(be.qt || 0);
        }

        if (allocatedForThisRow > 0) {
          allocatedQty += allocatedForThisRow;
          matchedBookings.push({
            event_id: be.event_id,
            event_name: be.event_name,
            template_name: be.template_name,
            allocated: allocatedForThisRow
          });
        }
      }
    });

    const availableQty = Math.max(0, totalQty - allocatedQty);
    const availableRatio = totalQty > 0 ? (availableQty / totalQty) : 0;
    const availablePercent = totalQty > 0 ? Math.round((availableQty / totalQty) * 100) : 0;

    return {
      ...inv,
      total_quantity: totalQty,
      allocated_quantity: allocatedQty,
      available_quantity: availableQty,
      available_ratio: availableRatio,
      available_percent: availablePercent,
      verticalSizes: vSizes,
      horizontalSizes: hSizes,
      matched_active_events: matchedBookings
    };
  });

  return result;
}

calculateInventoryAvailability().then(data => {
  const sampleWithAllocation = data.filter(d => d.allocated_quantity > 0);
  console.log('Sample items with active event allocation:', JSON.stringify(sampleWithAllocation, null, 2));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
