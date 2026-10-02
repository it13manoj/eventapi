const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");
const User = require("./User");
const TeamAssignUser = require("./TeamAssignUser");
const Events = require("./Events");
const Category = require("./Category");
const SubCategory = require("./SubCategory");
const Inventory = require("./Inventory");


const TeamAssign = sequelize.define(
    "TeamAssign",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },


        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Events,
                key: "id",
            },
        },
        installing: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        uninstalling: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
    tableName: "team_assigns",
    timestamps: true,
})


// TeamAssign.hasMany(TeamAssignUser, {
//   foreignKey: "team_assign_id",
//   as: "TeamAssignUser"
// });



module.exports = TeamAssign;
