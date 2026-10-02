const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");

const Role = sequelize.define("roles", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Role;