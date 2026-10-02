const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");
const Inventory = require("./Inventory");

const Items = sequelize.define("items", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    ft: {
        type: DataTypes.STRING,
        allowNull: true
    },
    qt: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    width: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    stock_id:{
         type: DataTypes.INTEGER,
        allowNull: false
    }


}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});




module.exports = Items;