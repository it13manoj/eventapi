const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");

const Category = sequelize.define("categories", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue:"1",
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});


module.exports = Category;