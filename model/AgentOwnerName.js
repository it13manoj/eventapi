const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");
const VehicleType = require("./VehicleType");

const AgentOwnerName = sequelize.define("agent_owner", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    
    owner_agency: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    
    status: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "1",
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});


module.exports = AgentOwnerName;