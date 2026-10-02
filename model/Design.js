const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");


const Design = sequelize.define("designs", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    design_name: {
        type: DataTypes.TEXT,
        allowNull: true
    }  

}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});




module.exports = Design;