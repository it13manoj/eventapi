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
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    permissions: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Role;