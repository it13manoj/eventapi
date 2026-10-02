const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");
const Category = require("./Category");

const SubCategory = sequelize.define("subcategories", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categories_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: "id"
        }
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_enable: {
        type: DataTypes.BOOLEAN,
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


SubCategory.belongsTo(Category, {
    foreignKey: "categories_id",
    as: "categories"
});


module.exports = SubCategory;