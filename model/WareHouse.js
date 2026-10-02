const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");

const wareHouse = sequelize.define("ware_house", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    capacity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    manager_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contact_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gst_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    license_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    google_link: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});


module.exports = wareHouse;