const Category = require("../../model/Category");
const Inventories = require("../../model/Inventory");
const SubCategory = require("../../model/SubCategory");
const WareHouse = require("../../model/WareHouse");

const InventoryVertical = require("../../model/InventoryVertical");
const InventoryHorizontal = require("../../model/InventoryHorizontal");

const Items = require("../../model/Items");
const BookedEvents = require("../../model/BookedEvents");
const { ERROR } = require("../../Response/Error");
const { SUCCESS } = require("../../Response/Success");
const { Op, fn, col } = require("sequelize");
const sequelize = require("../../db/conenction");

// Helper to clean size strings: "10ft" -> "10", "4" -> "4"
const cleanSize = (val) => String(val || "").replace(/[^\d.]/g, "").trim();

async function enrichInventoriesWithAvailability(inventoryList) {
  if (!inventoryList || inventoryList.length === 0) return [];

  try {
    // Fetch all active/uncompleted events with their booked items
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

    return inventoryList.map(item => {
      const raw = typeof item.toJSON === "function" ? item.toJSON() : { ...item };
      const vSizes = Array.isArray(raw.verticalSizes)
        ? raw.verticalSizes.map(v => ({
            ...v,
            allocated_qty: 0,
            available_qty: Number(v.quantity || 0),
            available_ratio: 1
          }))
        : [];
      const hSizes = Array.isArray(raw.horizontalSizes)
        ? raw.horizontalSizes.map(h => ({
            ...h,
            allocated_qty: 0,
            available_qty: Number(h.quantity || 0),
            available_ratio: 1
          }))
        : [];

      let totalQty = Number(raw.quantity || 0);
      if (raw.have_size) {
        const vTotal = vSizes.reduce((sum, s) => sum + Number(s.quantity || 0), 0);
        const hTotal = hSizes.reduce((sum, s) => sum + Number(s.quantity || 0), 0);
        totalQty = vTotal + hTotal;
      }

      let allocatedQty = 0;
      const matchedBookings = [];

      activeBooked.forEach(be => {
        let isMatch = false;

        let parsedStockIds = [];
        try {
          if (be.stock_id) {
            parsedStockIds = typeof be.stock_id === "string" ? JSON.parse(be.stock_id) : be.stock_id;
            if (!Array.isArray(parsedStockIds)) parsedStockIds = [parsedStockIds];
          }
        } catch (e) {}

        if (parsedStockIds.includes(raw.id) || parsedStockIds.includes(String(raw.id))) {
          isMatch = true;
        } else if (
          Number(be.categories_id) === Number(raw.categories_id) &&
          Number(be.subCategories_id) === Number(raw.sub_categories_id)
        ) {
          isMatch = true;
        }

        if (isMatch) {
          let allocatedForThisRow = 0;

          if (raw.have_size) {
            if (be.vertical && be.verticalValue) {
              const cleanVal = cleanSize(be.verticalValue);
              const vSize = vSizes.find(s => cleanSize(s.size) === cleanVal);
              if (vSize) {
                const pcs = Number(be.verticalPcs || 0);
                vSize.allocated_qty = (vSize.allocated_qty || 0) + pcs;
                vSize.available_qty = Math.max(0, Number(vSize.quantity) - vSize.allocated_qty);
                vSize.available_ratio = Number(vSize.quantity) > 0 ? (vSize.available_qty / Number(vSize.quantity)) : 0;
                allocatedForThisRow += pcs;
              }
            }

            if (be.horizontal && be.horizontalValue) {
              const cleanVal = cleanSize(be.horizontalValue);
              const hSize = hSizes.find(s => cleanSize(s.size) === cleanVal);
              if (hSize) {
                const pcs = Number(be.horizontalPcs || 0);
                hSize.allocated_qty = (hSize.allocated_qty || 0) + pcs;
                hSize.available_qty = Math.max(0, Number(hSize.quantity) - hSize.allocated_qty);
                hSize.available_ratio = Number(hSize.quantity) > 0 ? (hSize.available_qty / Number(hSize.quantity)) : 0;
                allocatedForThisRow += pcs;
              }
            }

            if (allocatedForThisRow === 0) {
              const pcs = Number(be.verticalPcs || be.horizontalPcs || be.qt || 0);
              allocatedForThisRow = pcs;
            }
          } else {
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
        ...raw,
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
  } catch (err) {
    console.error("enrichInventoriesWithAvailability error:", err);
    return inventoryList;
  }
}

// ======================================================
// CREATE
// ======================================================

exports.create = async (req, res) => {
  try {
    const {
      vertical_data,
      horizontal_data,
      ...inventoryData
    } = req.body;

    // ================= INVENTORY =================

    const inventory = await Inventories.create(
      inventoryData
    );

    // ================= VERTICAL =================

    if (
      inventoryData.vertical_enabled &&
      vertical_data &&
      vertical_data.length > 0
    ) {
      const verticalPayload = vertical_data.map(
        (row) => ({
          inventory_id: inventory.id,
          size: row.size,
          quantity: row.quantity,
          unit: row.unit,
        })
      );

      await InventoryVertical.bulkCreate(
        verticalPayload
      );
    }

    // ================= HORIZONTAL =================

    if (
      inventoryData.horizontal_enabled &&
      horizontal_data &&
      horizontal_data.length > 0
    ) {
      const horizontalPayload =
        horizontal_data.map((row) => ({
          inventory_id: inventory.id,
          size: row.size,
          quantity: row.quantity,
          unit: row.unit,
        }));

      await InventoryHorizontal.bulkCreate(
        horizontalPayload
      );
    }

    const results =
      await Inventories.findByPk(inventory.id, {
        include: [
          {
            model: Category,
            as: "categories",
          },
          {
            model: SubCategory,
            as: "subCategories",
          },
          {
            model: WareHouse,
            as: "wareHouse",
          },
          {
            model: InventoryVertical,
            as: "verticalSizes",
          },
          {
            model: InventoryHorizontal,
            as: "horizontalSizes",
          },
        ],
      });

    res.send(
      SUCCESS(
        "Inventory created successfully!",
        results
      )
    );
  } catch (error) {
    console.log(error);

    res.send(ERROR(error.message));
  }
};

// ======================================================
// UPDATE
// ======================================================

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      vertical_data,
      horizontal_data,
      ...inventoryData
    } = req.body;

    // ================= UPDATE INVENTORY =================

    await Inventories.update(inventoryData, {
      where: {
        id: id,
      },
    });

    // ================= DELETE OLD =================

    await InventoryVertical.destroy({
      where: {
        inventory_id: id,
      },
    });

    await InventoryHorizontal.destroy({
      where: {
        inventory_id: id,
      },
    });

    // ================= INSERT NEW VERTICAL =================

    if (
      inventoryData.vertical_enabled &&
      vertical_data &&
      vertical_data.length > 0
    ) {
      const verticalPayload = vertical_data.map(
        (row) => ({
          inventory_id: id,
          size: row.size,
          quantity: row.quantity,
          unit: row.unit,
        })
      );

      await InventoryVertical.bulkCreate(
        verticalPayload
      );
    }

    // ================= INSERT NEW HORIZONTAL =================

    if (
      inventoryData.horizontal_enabled &&
      horizontal_data &&
      horizontal_data.length > 0
    ) {
      const horizontalPayload =
        horizontal_data.map((row) => ({
          inventory_id: id,
          size: row.size,
          quantity: row.quantity,
          unit: row.unit,
        }));

      await InventoryHorizontal.bulkCreate(
        horizontalPayload
      );
    }

    const results = await Inventories.findByPk(id, {
      include: [
        {
          model: Category,
          as: "categories",
        },
        {
          model: SubCategory,
          as: "subCategories",
        },
        {
          model: WareHouse,
          as: "wareHouse",
        },
        {
          model: InventoryVertical,
          as: "verticalSizes",
        },
        {
          model: InventoryHorizontal,
          as: "horizontalSizes",
        },
      ],
    });

    res.send(
      SUCCESS(
        "Successfully Updated!",
        results
      )
    );
  } catch (error) {
    console.log(error);

    res.send(ERROR(error.message));
  }
};

// ======================================================
// FIND ALL
// ======================================================

exports.find = async (req, res) => {
  try {
    const rawResults = await Inventories.findAll({
      include: [
        {
          model: Category,
          as: "categories",
        },

        {
          model: SubCategory,
          as: "subCategories",
        },

        {
          model: WareHouse,
          as: "wareHouse",
        },

        {
          model: InventoryVertical,
          as: "verticalSizes",
        },

        {
          model: InventoryHorizontal,
          as: "horizontalSizes",
        },
      ],

      order: [["id", "DESC"]],
    });

    const results = await enrichInventoriesWithAvailability(rawResults);

    res.send(
      SUCCESS("Successfully!", results)
    );
  } catch (error) {
    console.log(error);

    res.send(ERROR(error.message));
  }
};

// ======================================================
// FIND BY PK
// ======================================================

exports.findByPk = async (req, res) => {
  try {
    const { id } = req.params;

    const raw = await Inventories.findByPk(
      id,
      {
        include: [
          {
            model: Category,
            as: "categories",
          },

          {
            model: SubCategory,
            as: "subCategories",
          },

          {
            model: WareHouse,
            as: "wareHouse",
          },

          {
            model: InventoryVertical,
            as: "verticalSizes",
          },

          {
            model: InventoryHorizontal,
            as: "horizontalSizes",
          },
        ],
      }
    );

    if (!raw) {
      return res.send(SUCCESS("Record not found", null));
    }

    const [results] = await enrichInventoriesWithAvailability([raw]);

    res.send(
      SUCCESS("Successfully!", results)
    );
  } catch (error) {
    console.log(error);

    res.send(ERROR(error.message));
  }
};

// ======================================================
// FIND BY CATEGORY
// ======================================================

exports.findBycategories = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const rawResults = await Inventories.findAll({
      where: {
        categories_id: id,
      },

      include: [
        {
          model: Category,
          as: "categories",
        },

        {
          model: SubCategory,
          as: "subCategories",
        },

        {
          model: WareHouse,
          as: "wareHouse",
        },

        {
          model: InventoryVertical,
          as: "verticalSizes",
        },

        {
          model: InventoryHorizontal,
          as: "horizontalSizes",
        },
      ],

      order: [["id", "DESC"]],
    });

    const results = await enrichInventoriesWithAvailability(rawResults);

    res.send(
      SUCCESS("Successfully!", results)
    );
  } catch (error) {
    console.log(error);

    res.send(ERROR(error.message));
  }
};

// ======================================================
// FIND BY CATEGORY + SUBCATEGORY
// ======================================================

exports.findBycategoriesAndSubCategories =
  async (req, res) => {
    try {
      const { cid, sid } = req.params;

      const rawResults =
        await Inventories.findAll({
          where: {
            categories_id: cid,
            sub_categories_id: sid,
          },

          include: [
            {
              model: Category,
              as: "categories",
            },

            {
              model: SubCategory,
              as: "subCategories",
            },

            {
              model: WareHouse,
              as: "wareHouse",
            },

            {
              model: InventoryVertical,
              as: "verticalSizes",
            },

            {
              model: InventoryHorizontal,
              as: "horizontalSizes",
            },
          ],

          order: [["id", "DESC"]],
        });

      const results = await enrichInventoriesWithAvailability(rawResults);

      res.send(
        SUCCESS("Successfully!", results)
      );
    } catch (error) {
      console.log(error);

      res.send(ERROR(error.message));
    }
  };

// ======================================================
// AVAILABLE STOCK SUMMARY (LIVE ALLOCATION RATIO)
// ======================================================

exports.availableStockSummary = async (req, res) => {
  try {
    const rawResults = await Inventories.findAll({
      include: [
        {
          model: Category,
          as: "categories",
        },
        {
          model: SubCategory,
          as: "subCategories",
        },
        {
          model: WareHouse,
          as: "wareHouse",
        },
        {
          model: InventoryVertical,
          as: "verticalSizes",
        },
        {
          model: InventoryHorizontal,
          as: "horizontalSizes",
        },
      ],
      order: [["id", "DESC"]],
    });

    const results = await enrichInventoriesWithAvailability(rawResults);

    res.send(
      SUCCESS("Available stock summary with ratios fetched successfully!", results)
    );
  } catch (error) {
    console.log(error);
    res.send(ERROR(error.message));
  }
};

// ======================================================
// COUNT ITEMS
// ======================================================

exports.countsItems = async (req, res) => {
  try {
    const { id } = req.params;

    const results = await Items.sum("qt", {
      where: {
        stock_id: id,
      },
    });

    res.send(
      SUCCESS("Successfully!", results || 0)
    );
  } catch (error) {
    console.log(error);

    res.send(ERROR(error.message));
  }
};

// ======================================================
// ITEMS
// ======================================================

exports.Items = async (req, res) => {
  try {
    const { id } = req.params;

    const results = await Items.findAll({
      where: {
        stock_id: id,
      },
    });

    res.send(
      SUCCESS("Successfully!", results)
    );
  } catch (error) {
    console.log(error);

    res.send(ERROR(error.message));
  }
};

// ======================================================
// DELETE
// ======================================================

exports.deletes = async (req, res) => {
  try {
    const { id } = req.params;

    await InventoryVertical.destroy({
      where: {
        inventory_id: id,
      },
    });

    await InventoryHorizontal.destroy({
      where: {
        inventory_id: id,
      },
    });

    const results = await Inventories.destroy({
      where: {
        id: id,
      },
    });

    res.send(
      SUCCESS(
        "Successfully Deleted!",
        results
      )
    );
  } catch (error) {
    console.log(error);

    res.send(ERROR(error.message));
  }
};

// ======================================================
// CALCULATE
// ======================================================

exports.calculate = async (req, res) => {
  try {
    const { catId, scatId } = req.params;

    const quantities =
      await Inventories.sum("quantity", {
        where: {
          categories_id: catId,
          sub_categories_id: scatId,
        },
      });

    const totalHeight =
      await Inventories.sum("height", {
        where: {
          categories_id: catId,
          sub_categories_id: scatId,
        },
      });

    const totalWidth =
      await Inventories.sum("width", {
        where: {
          categories_id: catId,
          sub_categories_id: scatId,
        },
      });

    res.send(
      SUCCESS("Successfully!", {
        quantities: quantities || 0,
        height: totalHeight || 0,
        width: totalWidth || 0,
      })
    );
  } catch (error) {
    console.log(error);

    res.send(ERROR(error.message));
  }
};


// ====================================Event Stock Filter

exports.eventStocks = async (req, res) => {
  try {
    const { date, catId, scatId } = req.params
    const results = await Inventories.findAll({
      include: [
        {
          model: Category,
          as: "categories",
        },

        {
          model: SubCategory,
          as: "subCategories",
        },

        {
          model: WareHouse,
          as: "wareHouse",
        },

        {
          model: InventoryVertical,
          as: "verticalSizes",
        },

        {
          model: InventoryHorizontal,
          as: "horizontalSizes",
        },
      ],
      where: {
        categories_id: catId,
        sub_categories_id: scatId,
      },
      order: [["id", "DESC"]],
    });

    const enrichedResults = await enrichInventoriesWithAvailability(results);

    const [results_booked] = await sequelize.query(`
      SELECT be.*
      FROM booked_events be
      JOIN events e ON e.id = be.event_id
      WHERE be.categories_id = :catId
        AND be.subCategories_id = :scatId
        AND e.status NOT IN ('3', '4', 'Finished', 'Event Finished', 'Complete', 'Completed', 'Cancelled', 'Cancelled/Postpone')
    `, {
      replacements: { catId, scatId }
    });

    const [results_booked_events] = await sequelize.query(`
      SELECT be.*
      FROM booked_events be
      JOIN events e ON e.id = be.event_id
      WHERE be.categories_id = :catId
        AND be.subCategories_id = :scatId
        AND e.status NOT IN ('3', '4', 'Finished', 'Event Finished', 'Complete', 'Completed', 'Cancelled', 'Cancelled/Postpone')
    `, {
      replacements: { catId, scatId }
    });

    res.send(
      SUCCESS("Successfully!", { results: enrichedResults, results_booked, results_booked_events })
    );
  } catch (error) {
    console.log(error);

    res.send(ERROR(error.message));
  }
};