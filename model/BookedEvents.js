const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");

const BookedEvents = sequelize.define(
  "booked_events",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // ================= CATEGORY =================

    categories_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    categories_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ================= SUB CATEGORY =================

    subCategories_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    subCategories_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ================= NORMAL QUANTITY =================

    qt: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    // ================= EVENT =================

    event_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // ================= SIZE ENABLE =================

    vertical: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    horizontal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // ================= VERTICAL =================

    verticalValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    verticalPcs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    verticalUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ================= HORIZONTAL =================

    horizontalValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    horizontalPcs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    horizontalUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    evnt_items_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },

    vprice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },

    hprice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    stock_id: {
      type: DataTypes.JSON,
      allowNull: true
    },

    event_stock_id: {
      type: DataTypes.JSON,
      allowNull: true
    },
    st_qt: {
      type: DataTypes.JSON,
      allowNull: true
    },
    evnt_qt: {
      type: DataTypes.JSON,
      allowNull: true
    },
    evetn_start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    event_end_Date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = BookedEvents;