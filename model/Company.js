const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");


const Companies = sequelize.define(
        "Companies",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            companyName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING
            },
            phone: {
                type: DataTypes.STRING
            },
            website: {
                type: DataTypes.STRING
            },
            gstNumber: {
                type: DataTypes.STRING
            },
            foundedYear: {
                type: DataTypes.INTEGER
            },
            totalEvents: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            teamMembers: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            address: {
                type: DataTypes.TEXT
            },
            aboutCompany: {
                type: DataTypes.TEXT
            },
            logo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
                defaultValue: 'ACTIVE'
            }
        },
        {
            tableName: "companies",
            timestamps: true
        }
    );


module.exports = Companies;