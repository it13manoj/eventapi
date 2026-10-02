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
            designName, bookedItems, stockDetails, eventDetails, id
        } = req.body;
        let event = id
        // ================= DESIGN =================

        const [design] = await Design.findOrCreate({
            where: { design_name: designName },
            defaults: { design_name: designName },
            transaction: t
        });

        const designId = design.id;

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
                    categories_id,
                    sub_categories_id
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
                categories_id,
                sub_categories_id
            }, { transaction: t });
        }
        // ================= EVENT =================



        const eventId = id != null ? id : event.id;

        // ================= ITEMS =================

        const itemsPayload = bookedItems.map((item) => ({
            event_id: eventId,

            categories_id: item.categories.id,
            categories_name: item.categories.name,

            subCategories_id: item.subCategories.id,
            subCategories_name: item.subCategories.name,

            qt: item.subCategories.is_enable
                ? 0
                : item.inputs.value || 0,

            price: item.subCategories.is_enable
                ? 0
                : item.inputs.price || 0,
            vprice: item.inputs.vprice || 0,

            hprice: item.inputs.hprice || 0,

            vertical: item.inputs.vertical || false,
            horizontal: item.inputs.horizontal || false,

            verticalValue:
                item.inputs.verticalValue || null,

            verticalPcs:
                item.inputs.verticalPcs || 0,

            verticalUnit:
                item.inputs.verticalUnit || null,

            horizontalValue:
                item.inputs.horizontalValue || null,

            horizontalPcs:
                item.inputs.horizontalPcs || 0,

            horizontalUnit:
                item.inputs.horizontalUnit || null,
            evetn_start_date: doe,
            event_end_Date: nodb
        }));

        if (id != null) {
            await BookedEvents.destroy({
                where: {
                    event_id: id
                },
                logging: console.log
            });
        }

        await BookedEvents.bulkCreate(
            itemsPayload,
            { transaction: t, logging: console.log }
        );

        // ================= STOCK UPDATE =================

        for (const item of stockDetails) {

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

        for (const item of eventDetails) {

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
        const { id } = req.params
        const { c_name, vanus, doe, v_location, v_a_d, nodb, pob, tc, sr, amount, status, width, height, quntites, categories_id, sub_categories_id } = req.body;
        const result = await Events.update({
            c_name, vanus, doe, v_location, v_a_d, nodb, pob, tc, sr, amount, status, categories_id, sub_categories_id
        }, {
            where: {
                id: id
            }
        })
        res.send(SUCCESS("Successfully Event update", result))
    } catch (error) {
        res.send(ERROR(error))
    }
}


exports.find = async (req, res) => {
    try {
        const result = await Events.findAll({
            // include:[{
            //          model: BookedEvents,
            //          as : "event_id"
            // }],
            order: [['id', 'DESC']]
        })
        res.send(SUCCESS("Records", result))
    } catch (error) {
        res.send(ERROR(error))
    }
}

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
        const { status } = req.body
        const result = await Events.update({
            status
        }, {
            where: { id: id }
        })
        res.send(SUCCESS("Successfully Event update", result))
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
        const endDate = new Date(date);
        console.log(date, catId, subCatId)

        const formattedDate = new Date(endDate)
            .toISOString()
            .split("T")[0];


        const result = await sequelize.query(
            `
    SELECT 
      e.id,
      e.c_name,
      e.nodb,
      e.doe, 
      e.vanus,  
      e.v_location,   
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
      be.created_at,
      be.updated_at

    FROM events AS e

    INNER JOIN booked_events be
      ON be.event_id = e.id

    WHERE DATE(e.nodb) = :formattedDate
      AND be.categories_id = :catId
      AND be.subCategories_id = :subCatId
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

        console.log(result)


        res.send(SUCCESS("Successfully Event update", result))
    } catch (error) {
        res.send(ERROR(error))
    }
}


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
    WHERE DATE(be.event_end_Date) >= :formattedDate
      AND be.categories_id = :catId
      AND be.subCategories_id = :subCatId
      AND JSON_CONTAINS(be.stock_id, :stockId)
    `,
            {
                replacements: {
                    formattedDate,
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

        const result = await sequelize.query(
            `
            SELECT 
                e.id,
                e.c_name,
                e.nodb,
                e.doe,
                e.vanus,
                e.v_location,
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
            INNER JOIN booked_events be
                ON be.event_id = e.id
            WHERE e.status = "3" order by e.id DESC
            `,
            {
                type: QueryTypes.SELECT,
            }
        );

        const invoices = Object.values(
            result.reduce((acc, row) => {

                if (!acc[row.id]) {
                    acc[row.id] = {
                        id: `INV-${row.id}`,
                        customer: row.c_name,
                        date: row.nodb,
                        eventDate: row.doe,
                        mobile: "NA",
                        address: row.v_location,
                        amount: 0,
                        status: "Paid",
                        items: []
                    };
                }

                const itemAmount =
                    (Number(row?.vprice || 0) + Number(row?.hprice || 0)) +
                    (Number(row?.price || 0) );

                acc[row.id].items.push({
                    bookedEventId: row.booked_event_id,
                    categoryId: row.categories_id,
                    categoryName: row.categories_name,
                    subCategoryId: row.subCategories_id,
                    subCategoryName: row.subCategories_name,
                    qty: row.qt,
                    vprice:row.vprice,
                    hprice:row.hprice,
                    sprice:row.price,
                    horizontalPcs:row.horizontalPcs,
                    verticalPcs:row.verticalPcs,
                    vertical: row.vertical,
                    horizontal: row.horizontal,
                    verticalUnit: row.verticalUnit,
                    horizontalUnit: row.horizontalUnit,
                    
                });
                
                acc[row.id].amount += itemAmount;

                return acc;
            }, {})
        );

        res.send(
            SUCCESS("Successfully Invoice", invoices)
        );

    } catch (error) {
        console.error(error);
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
