const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");

const Inventory = require("./Inventory");

const InventoryVertical = sequelize.define(
  "inventory_vertical_sizes",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    inventory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: Inventory,
        key: "id",
      },
    },

    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

Inventory.hasMany(InventoryVertical, {
  foreignKey: "inventory_id",
  as: "verticalSizes",
});

InventoryVertical.belongsTo(Inventory, {
  foreignKey: "inventory_id",
  as: "inventory",
});

module.exports = InventoryVertical;