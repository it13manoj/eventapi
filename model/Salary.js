const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");
const Inventory = require("./Inventory");

const Salary = sequelize.define("salaries", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    paid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    remaing: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    extra_pay: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});




module.exports = Salary;