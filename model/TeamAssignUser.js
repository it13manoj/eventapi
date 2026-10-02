const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");
const Events = require("./Events");

const TeamAssign = require("./TeamAssign");
const User = require("./User");



const TeamAssignUser = sequelize.define(
    "TeamAssignUser",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        team_assign_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "team_assigns",
                key: "id",
            },
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },

        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Events,
                key: "id",
            },
        },

        status: {
            type: DataTypes.STRING, // pending / completed
            defaultValue: "pending",
        },

        assignedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "team_assign_users",
        timestamps: false,
    }
);


// TeamAssignUser.belongsTo(User, {
//     foreignKey: "user_id",
//     as: "users"
// });

// TeamAssign.hasMany(TeamAssignUser, {
//     foreignKey: "team_assign_id",
//     as: "TeamAssignUser"
// });

// TeamAssignUser -> TeamAssign
// TeamAssignUser.belongsTo(TeamAssign, {
//     foreignKey: "team_assign_id"
// });


module.exports = TeamAssignUser;
