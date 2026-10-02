const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");

const Category = require("./Category");
const SubCategory = require("./SubCategory");
const WareHouse = require("./WareHouse");

const Inventory = sequelize.define(
  "inventories",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    width: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    quality: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },

    // ================= STOCK =================

    good: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    bad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    missing: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    // ================= SIZE =================

    have_size: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    vertical_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    horizontal_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // ================= STATUS =================

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    // ================= FOREIGN KEYS =================

    ware_house_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: WareHouse,
        key: "id",
      },
    },

    categories_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: Category,
        key: "id",
      },
    },

    sub_categories_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: SubCategory,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// ================= RELATIONS =================

Inventory.belongsTo(Category, {
  foreignKey: "categories_id",
  as: "categories",
});

Inventory.belongsTo(SubCategory, {
  foreignKey: "sub_categories_id",
  as: "subCategories",
});

Inventory.belongsTo(WareHouse, {
  foreignKey: "ware_house_id",
  as: "wareHouse",
});

module.exports = Inventory;