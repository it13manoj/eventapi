const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");

const VehicleType = sequelize.define("vehicle_type", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    wheel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    fuel_type: {
        type: DataTypes.ENUM("diesel", "petrol", "cng", "electric"),
        allowNull: false,
        defaultValue: "diesel",
    },
    isActive: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "1",
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = VehicleType;