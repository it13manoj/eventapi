const Events = require("../../model/Events");
const { ERROR } = require("../../Response/Error");
const { SUCCESS } = require("../../Response/Success");
const { Op, fn, col, QueryTypes } = require("sequelize");
const Design = require("../../model/Design");
const BookedEvents = require("../../model/BookedEvents");
const sequelize = require("../../db/conenction");


exports.create = async (req, res) => {
    const t = await sequelize.transaction();

    try {

        const {
            c_name, vanus, doe, v_location, v_a_d, nodb, pob,
            tc, sr, amount, status,
            categories_id, sub_categories_id,
            designName, bookedItems, stockDetails, eventDetails, id,
            template_id, template_name
        } = req.body;
        let event = id
        // ================= DESIGN =================

        const [design] = await Design.findOrCreate({
            where: { design_name: designName },
            defaults: { design_name: designName },
            transaction: t
        });

        const designId = design.id;

        const safeCategoriesId = categories_id && Number(categories_id) > 0 ? Number(categories_id) : null;
        const safeSubCategoriesId = sub_categories_id && Number(sub_categories_id) > 0 ? Number(sub_categories_id) : null;

        if (id != null) {
            await Events.update(
                {
                    design_id: designId,
                    c_name,
                    vanus,
                    doe,
                    v_location,
                    v_a_d,
                    nodb,
                    pob,
                    tc,
                    sr,
                    amount,
                    status,
                    categories_id: safeCategoriesId,
                    sub_categories_id: safeSubCategoriesId,
                    template_id: template_id && Number(template_id) > 0 ? Number(template_id) : null,
                    template_name: template_name || null
                },
                {
                    where: { id: id },
                    transaction: t,
                    logging: console.log
                }
            );
        } else {
            event = await Events.create({
                design_id: designId,
                c_name,
                vanus,
                doe,
                v_location,
                v_a_d,
                nodb,
                pob,
                tc,
                sr,
                amount,
                status,
                categories_id: safeCategoriesId,
                sub_categories_id: safeSubCategoriesId,
                template_id: template_id && Number(template_id) > 0 ? Number(template_id) : null,
                template_name: template_name || null
            }, { transaction: t });
        }
        // ================= EVENT =================

        const eventId = id != null ? id : event.id;

        // ================= ITEMS =================
        const safeBookedItems = Array.isArray(bookedItems) ? bookedItems : [];
        const itemsPayload = safeBookedItems
            .filter((item) => item && (item.categories?.id || item.subCategories?.id))
            .map((item) => ({
                event_id: eventId,

                categories_id: item.categories?.id || null,
                categories_name: item.categories?.name || "",

                subCategories_id: item.subCategories?.id || null,
                subCategories_name: item.subCategories?.name || "",

                qt: item.subCategories?.is_enable
                    ? 0
                    : item.inputs?.value || 0,

                price: item.subCategories?.is_enable
                    ? 0
                    : item.inputs?.price || 0,
                vprice: item.inputs?.vprice || 0,

                hprice: item.inputs?.hprice || 0,

                vertical: item.inputs?.vertical || false,
                horizontal: item.inputs?.horizontal || false,

                verticalValue:
                    item.inputs?.verticalValue || null,

                verticalPcs:
                    item.inputs?.verticalPcs || 0,

                verticalUnit:
                    item.inputs?.verticalUnit || null,

                horizontalValue:
                    item.inputs?.horizontalValue || null,

                horizontalPcs:
                    item.inputs?.horizontalPcs || 0,

                horizontalUnit:
                    item.inputs?.horizontalUnit || null,
                evetn_start_date: doe,
                event_end_Date: nodb,
                status: status || "0"
            }));

        if (id != null) {
            await BookedEvents.destroy({
                where: {
                    event_id: id
                },
                logging: console.log
            });
        }

        if (itemsPayload.length > 0) {
            await BookedEvents.bulkCreate(
                itemsPayload,
                { transaction: t, logging: console.log }
            );
        }

        // ================= STOCK UPDATE =================
        const safeStockDetails = Array.isArray(stockDetails) ? stockDetails : [];
        for (const item of safeStockDetails) {
            if (!item || !item.Categories || !item.SubCategoreis) continue;

            await BookedEvents.update(
                {
                    stock_id: item.stock_id,
                    st_qt: item.st_qt,
                },
                {
                    where: {
                        categories_id: item.Categories,
                        subCategories_id: item.SubCategoreis,
                        event_id: eventId,
                    },
                    transaction: t,
                }
            );
        }

        // ================= EVENT UPDATE =================
        const safeEventDetails = Array.isArray(eventDetails) ? eventDetails : [];
        for (const item of safeEventDetails) {
            if (!item || !item.Categories || !item.SubCategoreis) continue;

            await BookedEvents.update(
                {
                    event_stock_id: item.event_stock_id,
                    evnt_qt: item.evnt_qt,
                },
                {
                    where: {
                        categories_id: item.Categories,
                        subCategories_id: item.SubCategoreis,
                        event_id: eventId,
                    },
                    transaction: t,
                    logging: console.log
                }
            );
        }

        // ✅ COMMIT AT END

        await t.commit();

        res.send(
            SUCCESS(
                "Successfully Event Created",
                event
            )
        );

    } catch (error) {

        // ✅ SAFE ROLLBACK

        if (!t.finished) {
            await t.rollback();
        }

        console.error(error);

        res.send(ERROR(error));
    }
};

const findDesing = async (req, res) => {
    try {
        const result = await Design.findAll({
            order: [['id', 'DESC']]
        })
        res.send(SUCCESS("Records", result))
    } catch (error) {
        res.send(ERROR(error))
    }
}


exports.findEventBookedItems = async (req, res) => {
    try {
        const { id } = req.params
        const result = await BookedEvents.findAll({
            where: { event_id: id },
            order: [['id', 'DESC']]
        })
        res.send(SUCCESS("Records", result))
    } catch (error) {
        res.send(ERROR(error))
    }
}

exports.ItemBooksDetails = async (req, res) => {
    try {
        const result = await Events.findAll({
            where: { status: "3" },
            order: [['id', 'DESC']]
        })
        res.send(SUCCESS("Records", result))
    } catch (error) {
        res.send(ERROR(error))
    }

}



exports.getDesign = async (req, res) => {
    try {
        const result = await Design.findAll({
            order: [['id', 'DESC']]
        })
        res.send(SUCCESS("Records", result))
    } catch (error) {
        res.send(ERROR(error))
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { c_name, vanus, doe, v_location, v_a_d, nodb, pob, tc, sr, amount, status, width, height, quntites, categories_id, sub_categories_id, template_id, template_name } = req.body;
        const safeCatId = categories_id && Number(categories_id) > 0 ? Number(categories_id) : null;
        const safeSubCatId = sub_categories_id && Number(sub_categories_id) > 0 ? Number(sub_categories_id) : null;
        const result = await Events.update({
            c_name, vanus, doe, v_location, v_a_d, nodb, pob, tc, sr, amount, status, width, height, quntites,
            categories_id: safeCatId,
            sub_categories_id: safeSubCatId,
            ...(template_id !== undefined ? { template_id: template_id && Number(template_id) > 0 ? Number(template_id) : null } : {}),
            ...(template_name !== undefined ? { template_name: template_name || null } : {})
        }, {
            where: {
                id: id
            }
        });
        if (status !== undefined) {
            await BookedEvents.update({ status }, { where: { event_id: id } });
        }
        res.send(SUCCESS("Successfully Event update", result));
    } catch (error) {
        res.send(ERROR(error))
    }
}


exports.find = async (req, res) => {
    try {
        const result = await Events.findAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(DISTINCT tmu.id)
                            FROM team_assign_users AS tmu
                            LEFT JOIN team_assigns AS ta ON ta.id = tmu.team_assign_id
                            WHERE tmu.event_id = events.id OR ta.event_id = events.id
                        )`),
                        'team_count'
                    ]
                ]
            },
            order: [['id', 'DESC']]
        });
        res.send(SUCCESS("Records", result));
    } catch (error) {
        res.send(ERROR(error));
    }
};

exports.findByPk = async (req, res) => {
    try {
        const { id } = req.params
        const result = await Events.findByPk(id)
        res.send(SUCCESS("Records", result))
    } catch (error) {
        res.send(ERROR(error))
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await Events.update({
            status
        }, {
            where: { id: id }
        });
        await BookedEvents.update({
            status
        }, {
            where: { event_id: id }
        });
        res.send(SUCCESS("Successfully Event update", result));
    } catch (error) {
        res.send(ERROR(error))
    }
}




exports.calculate = async (req, res) => {
    try {
        const { date, num, catid, scatid } = req.params;

        // 🔹 Start Date (00:00:00)
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        // 🔹 End Date (add num days → 23:59:59)
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + Number(num));
        endDate.setHours(23, 59, 59, 999);

        // 🔥 IMPORTANT: Adjust backward (assume max 3-day event)
        const adjustedStart = new Date(startDate);
        adjustedStart.setDate(adjustedStart.getDate() - 3);

        console.log("Search Start:", startDate);
        console.log("Search End:", endDate);
        console.log("Adjusted Start:", adjustedStart);

        const whereCondition = {
            doe: {
                [Op.between]: [adjustedStart, endDate],
            },
            categories_id: catid,
            sub_categories_id: scatid,
        };

        // ✅ Single query (optimized)
        const result = await Events.findOne({
            attributes: [
                [fn("SUM", col("quntites")), "totalQty"],
                [fn("SUM", col("width")), "totalWidth"],
                [fn("SUM", col("height")), "totalHeight"],
            ],
            where: whereCondition,
            raw: true,
            logging: console.log,
        });

        res.json({
            quntites: result?.totalQty ?? 0,
            width: result?.totalWidth ?? 0,
            height: result?.totalHeight ?? 0,
        });

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};




exports.getBookedInventroyDate = async (req, res) => {
    try {
        const { date, catId, subCatId } = req.params;
        console.log("getBookedInventroyDate params:", { date, catId, subCatId });

        let formattedDate = "";
        if (date) {
            if (date.includes("T")) {
                formattedDate = date.split("T")[0];
            } else if (date.includes(" ")) {
                formattedDate = date.split(" ")[0];
            } else {
                formattedDate = date;
            }
        }
        if (!formattedDate) {
            formattedDate = new Date().toISOString().split("T")[0];
        }

        const result = await sequelize.query(
            `
    SELECT 
      e.id,
      e.c_name,
      e.nodb,
      e.doe, 
      e.vanus,  
      e.v_location,
      e.status,
      be.id AS booked_event_id,
      be.categories_id,
      be.categories_name,
      be.subCategories_id,
      be.subCategories_name,
      be.vertical,
      be.horizontal,
      be.verticalValue,
      be.verticalPcs,
      be.verticalUnit,
      be.horizontalValue,
      be.horizontalPcs,
      be.horizontalUnit,
      be.qt,
      be.event_id,
      be.event_stock_id,
      be.evnt_qt,
      be.created_at,
      be.updated_at

    FROM events AS e

    INNER JOIN booked_events be
      ON be.event_id = e.id

    WHERE be.categories_id = :catId
      AND be.subCategories_id = :subCatId
      AND e.status NOT IN ('5', '6', 'Cancelled', 'Postpone', 'Cancelled/Postpone')
      AND (
        DATE(e.nodb) <= :formattedDate
        OR e.status IN ('4', 'Finished', 'Event Finished', 'Complete', 'Completed')
        OR DATE(e.nodb) = :formattedDate
      )
    ORDER BY e.nodb DESC, e.id DESC
  `,
            {
                replacements: {
                    formattedDate,
                    catId,
                    subCatId,
                },
                type: QueryTypes.SELECT,
            }
        );

        res.send(SUCCESS("Successfully fetched events stock", result));
    } catch (error) {
        console.error("getBookedInventroyDate error:", error);
        res.send(ERROR(error.message || error));
    }
};


exports.bookedItemsInStocked = async (req, res) => {
    try {
        const { date, catId, subCatId, stockId } = req.params;

        console.log(date, catId, subCatId, stockId);

        const formattedDate = new Date(date)
            .toISOString()
            .split("T")[0];

        const result = await sequelize.query(
            `
    SELECT
        COALESCE(SUM(be.verticalPcs), 0) AS vertical,
        COALESCE(SUM(be.horizontalPcs), 0) AS horizontal,
        COALESCE(SUM(be.qt), 0) AS quantities
    FROM booked_events be
    JOIN events e ON e.id = be.event_id
    WHERE e.status NOT IN ('4', '5', '6', 'Finished', 'Event Finished', 'Complete', 'Completed', 'Cancelled', 'Postpone', 'Cancelled/Postpone')
      AND be.categories_id = :catId
      AND be.subCategories_id = :subCatId
      AND (
        JSON_CONTAINS(be.stock_id, :stockId)
        OR be.stock_id IS NULL
        OR be.stock_id = ''
        OR be.stock_id = '[]'
      )
    `,
            {
                replacements: {
                    catId,
                    subCatId,
                    stockId: JSON.stringify(Number(stockId))
                },
                type: QueryTypes.SELECT
            }
        );

        return res.send(
            SUCCESS("Data fetched successfully", result)
        );

    } catch (error) {
        console.error(error);
        return res.send(ERROR(error));
    }
};




exports.invoiceItems = async (req, res) => {
    try {
        const eventRows = await sequelize.query(
            `
            SELECT 
                e.id,
                e.c_name,
                e.nodb,
                e.doe,
                e.vanus,
                e.v_location,
                e.tc AS transport_charges,
                e.amount AS event_base_amount,
                e.status AS event_status,
                e.template_id,
                e.template_name,
                e.partner_name,
                e.partner_gst,
                e.partner_phone,
                e.partner_address,
                e.invoice_notes,
                e.gst_rate,
                et.name AS db_template_name,
                et.total_price AS db_template_total_price,
                be.id AS booked_event_id,
                be.categories_id,
                be.categories_name,
                be.subCategories_id,
                be.subCategories_name,
                be.vertical,
                be.horizontal,
                be.verticalValue,
                be.verticalPcs,
                be.verticalUnit,
                be.horizontalValue,
                be.horizontalPcs,
                be.horizontalUnit,
                be.qt,
                be.vprice,
                be.hprice,
                be.price,
                be.event_id,
                be.created_at,
                be.updated_at
            FROM events e
            LEFT JOIN booked_events be
                ON be.event_id = e.id
            LEFT JOIN event_templates et
                ON et.id = e.template_id
            WHERE e.status NOT IN ('5', 'Cancelled')
            ORDER BY e.id DESC
            `,
            {
                type: QueryTypes.SELECT,
            }
        );

        // Fetch vehicle movements with vehicle details
        const vehicleRows = await sequelize.query(
            `
            SELECT 
                vm.id AS movement_id,
                vm.event_id,
                vm.type AS vehicle_type,
                vm.agent_name,
                vm.vehicle_id,
                vm.fuel_type,
                vm.fuel_quantity,
                vm.fuel_amount,
                vm.status AS movement_status,
                v.name AS vehicle_name,
                v.vehicle_number,
                v.owner_agency,
                v.ownershiptype,
                v.commission
            FROM vehicle_movements vm
            LEFT JOIN vehicles v ON v.id = vm.vehicle_id
            ORDER BY vm.id ASC
            `,
            {
                type: QueryTypes.SELECT,
            }
        );

        // Fetch payment histories to compute paid and remaining balances
        const paymentRows = await sequelize.query(
            `
            SELECT 
                event_id, 
                SUM(price) AS total_paid
            FROM event_pay_histories
            GROUP BY event_id
            `,
            {
                type: QueryTypes.SELECT,
            }
        );

        const paidMap = {};
        paymentRows.forEach(p => {
            paidMap[p.event_id] = Number(p.total_paid || 0);
        });

        // Group vehicles by event_id
        const vehicleMap = {};
        vehicleRows.forEach(vm => {
            if (!vehicleMap[vm.event_id]) {
                vehicleMap[vm.event_id] = [];
            }
            const fuelAmount = Number(vm.fuel_amount || 0);
            const commission = Number(vm.commission || 0);
            vehicleMap[vm.event_id].push({
                movementId: vm.movement_id,
                vehicleId: vm.vehicle_id,
                vehicleName: vm.vehicle_name || "Vehicle",
                vehicleNumber: vm.vehicle_number || "-",
                ownerAgency: vm.owner_agency || vm.agent_name || "Owner",
                type: vm.vehicle_type || "OWNER",
                fuelType: vm.fuel_type || "-",
                fuelQuantity: Number(vm.fuel_quantity || 0),
                fuelAmount: fuelAmount,
                commission: commission,
                totalCost: fuelAmount + commission,
                status: vm.movement_status || "ASSIGNED"
            });
        });

        const invoiceMap = {};

        eventRows.forEach(row => {
            if (!invoiceMap[row.id]) {
                const assignedVehicles = vehicleMap[row.id] || [];
                const vehiclesSubtotal = assignedVehicles.reduce((sum, v) => sum + v.totalCost, 0);
                const paid = paidMap[row.id] || 0;

                const templateName = row.template_name || row.db_template_name || (row.template_id ? `Template #${row.template_id}` : "");
                const templatePrice = Number(row.db_template_total_price || 0);
                const eventCost = Number(
                    row.event_base_amount !== null && row.event_base_amount !== undefined && Number(row.event_base_amount) > 0
                        ? row.event_base_amount
                        : templatePrice
                );
                const transportCost = Number(
                    row.transport_charges !== null && row.transport_charges !== undefined && !isNaN(Number(row.transport_charges))
                        ? row.transport_charges
                        : 0
                );
                const hasTemplate = !!(row.template_id || (templateName && templateName.trim() !== "") || templatePrice > 0);

                invoiceMap[row.id] = {
                    id: `INV-${row.id}`,
                    eventId: row.id,
                    customer: row.c_name,
                    date: row.nodb,
                    eventDate: row.doe,
                    venue: row.vanus || "Venue",
                    mobile: "NA",
                    address: row.v_location || row.vanus || "Venue",
                    partnerName: row.partner_name || "",
                    partnerGst: row.partner_gst || "",
                    partnerPhone: row.partner_phone || "",
                    partnerAddress: row.partner_address || "",
                    invoiceNotes: row.invoice_notes || "",
                    gstRate: Number(row.gst_rate || 0),
                    templateId: row.template_id || null,
                    templateName: templateName,
                    templatePrice: templatePrice,
                    hasTemplate: hasTemplate,
                    eventCost: eventCost,
                    transportCost: transportCost,
                    itemsSubtotal: 0,
                    vehiclesSubtotal: vehiclesSubtotal,
                    amount: eventCost + transportCost + vehiclesSubtotal,
                    paidAmount: paid,
                    unpaidAmount: 0,
                    status: "Unpaid",
                    items: [],
                    vehicles: assignedVehicles
                };
            }

            if (row.booked_event_id) {
                const vPrice = Number(row.vprice || 0);
                const hPrice = Number(row.hprice || 0);
                const sPrice = Number(row.price || 0);

                const baseAmount = vPrice > 0
                    ? vPrice
                    : hPrice > 0
                        ? hPrice
                        : sPrice;

                const qty = row.verticalUnit
                    ? Number(row.verticalPcs || 0)
                    : row.horizontalUnit
                        ? Number(row.horizontalPcs || 0)
                        : Number(row.qt || 0);

                const lineTotal = baseAmount;

                invoiceMap[row.id].items.push({
                    bookedEventId: row.booked_event_id,
                    categoryId: row.categories_id,
                    categoryName: row.categories_name,
                    subCategoryId: row.subCategories_id,
                    subCategoryName: row.subCategories_name,
                    qty: qty || Number(row.qt || 1),
                    vprice: vPrice,
                    hprice: hPrice,
                    sprice: sPrice,
                    horizontalPcs: row.horizontalPcs,
                    verticalPcs: row.verticalPcs,
                    vertical: row.vertical,
                    horizontal: row.horizontal,
                    verticalUnit: row.verticalUnit,
                    horizontalUnit: row.horizontalUnit,
                    rate: baseAmount,
                    lineTotal: lineTotal,
                    includedInTemplate: false
                });

                invoiceMap[row.id].itemsSubtotal += lineTotal;
                invoiceMap[row.id].amount += lineTotal;
            }
        });

        const invoices = Object.values(invoiceMap).map(inv => {
            inv.unpaidAmount = Math.max(0, inv.amount - inv.paidAmount);
            inv.status = inv.unpaidAmount <= 0 && inv.amount > 0
                ? "Paid"
                : inv.paidAmount > 0
                    ? "Partial"
                    : "Unpaid";
            return inv;
        });

        res.send(
            SUCCESS("Successfully Invoice", invoices)
        );

    } catch (error) {
        console.error(error);
        res.send(ERROR(error));
    }
};

exports.updateInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            partner_name,
            partner_gst,
            partner_phone,
            partner_address,
            invoice_notes,
            gst_rate
        } = req.body;

        const cleanId = String(id).replace("INV-", "");
        const event = await Events.findByPk(cleanId);
        if (!event) {
            return res.send(ERROR("Event not found"));
        }

        await event.update({
            partner_name: partner_name !== undefined ? (partner_name ? String(partner_name).trim() : null) : event.partner_name,
            partner_gst: partner_gst !== undefined ? (partner_gst ? String(partner_gst).trim().toUpperCase() : null) : event.partner_gst,
            partner_phone: partner_phone !== undefined ? (partner_phone ? String(partner_phone).trim() : null) : event.partner_phone,
            partner_address: partner_address !== undefined ? (partner_address ? String(partner_address).trim() : null) : event.partner_address,
            invoice_notes: invoice_notes !== undefined ? (invoice_notes ? String(invoice_notes).trim() : null) : event.invoice_notes,
            gst_rate: gst_rate !== undefined ? Number(gst_rate || 0) : event.gst_rate
        });

        res.send(SUCCESS("Invoice and Partner details updated successfully", event));
    } catch (error) {
        console.error("updateInvoiceDetails error:", error);
        res.send(ERROR(error));
    }
};

exports.deletes = async (req, res) => {
    try {
        const { id } = req.params;

        await BookedEvents.destroy({
            where: { event_id: id }
        });

        const results = await Events.destroy({
            where: { id: id }
        });

        res.send(SUCCESS("Successfully Deleted Event", results));
    } catch (error) {
        console.error(error);
        res.send(ERROR(error));
    }
};
