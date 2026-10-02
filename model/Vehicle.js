const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");
const VehicleType = require("./VehicleType");

const Vehicle = sequelize.define("vehicles", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicle_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicle_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: VehicleType,
            key: "id"
        }
    },
    owner_agency: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contact: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    driver_contact: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    ownershiptype: {
        type: DataTypes.STRING,
        allowNull: true
    },
    load_capacity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    commission: {
        type: DataTypes.STRING,
        allowNull: true
    },
    insurance: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
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


Vehicle.belongsTo(VehicleType, {
    foreignKey: "vehicle_type_id",
    as: "vehiclesTypes"
});


module.exports = Vehicle;