const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");

const AttendanceRecord = sequelize.define(
    "AttendanceRecord",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "absent",
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        shifts_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        hours_worked: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 8,
        },
        shift_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "attendance_records",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [
            {
                unique: true,
                fields: ["user_id", "date"],
            },
        ],
    }
);

module.exports = AttendanceRecord;

