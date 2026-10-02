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

      order: [["id", "DESC"]],
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
// FIND BY PK
// ======================================================

exports.findByPk = async (req, res) => {
  try {
    const { id } = req.params;

    const results = await Inventories.findByPk(
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

    const results = await Inventories.findAll({
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

      const results =
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

      res.send(
        SUCCESS("Successfully!", results)
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


    const results_booked = await BookedEvents.findAll({
      where: {
        categories_id: catId,
        subCategories_id: scatId,
        evetn_start_date: {
          [Op.lte]: new Date(date),
        },
        event_end_Date: {
          [Op.gte]: new Date(date),
        },
      },
    });

    const results_booked_events = await BookedEvents.findAll({
      where: {
        categories_id: catId,
        subCategories_id: scatId,
        event_end_Date: {
          [Op.eq]: new Date(date)
        }
      },
    });

    res.send(
      SUCCESS("Successfully!", { results, results_booked, results_booked_events })
    );
  } catch (error) {
    console.log(error);

    res.send(ERROR(error.message));
  }
};