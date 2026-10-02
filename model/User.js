const { DataTypes } = require("sequelize");
const sequelize = require("../db/conenction");
const bcrypt = require("bcryptjs");
const Role = require("./Role");

const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact: {
        type: DataTypes.STRING,
        unique: true
    },
    contact2: {
        type: DataTypes.STRING,
        unique: true
    },
    contact3: {
        type: DataTypes.STRING,
        unique: true
    },
    job: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dob: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
        defaultValue: 'male'
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    sifting_type: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    shift: {
        type: DataTypes.STRING,
        allowNull: true
    },
    base_pay: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    insurance: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    adharcard_front: {
        type: DataTypes.STRING,
        allowNull: true
    },
    adharcard_back: {
        type: DataTypes.STRING,
        allowNull: true
    },

    insurance_pic: {
        type: DataTypes.STRING,
        allowNull: true
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
            model: Role,
            key: "id"
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },

    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pincode: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    v_code: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isvarified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    isactive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role"
});

module.exports = User;;