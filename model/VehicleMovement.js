const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");


const VehicleMovement = sequelize.define(
  "vehicle_movements",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Event Details
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("OWNER", "AGENT"),
      allowNull: false,
    },

    agent_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Fuel Details
    fuel_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    fuel_quantity: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    fuel_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    // Loading
    loading_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    loading_datetime: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    loading_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Unloading
    unloading_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    unloading_datetime: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    unloading_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Event Place Loading
    event_loading_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    event_loading_datetime: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    event_loading_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Event Place Unloading
    event_unloading_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    event_unloading_datetime: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    event_unloading_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Workflow Status
    status: {
      type: DataTypes.ENUM(
        "ASSIGNED",
        "LOADING",
        "UNLOADING",
        "EVENT_LOADING",
        "EVENT_UNLOADING",
        "COMPLETED"
      ),
      defaultValue: "ASSIGNED",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = VehicleMovement;