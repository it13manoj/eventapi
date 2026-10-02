const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");

const EventPayHistory = sequelize.define(
    "event_pay_history",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        event_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },


        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        remaining: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },

        paid_date: {
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

module.exports = EventPayHistory;