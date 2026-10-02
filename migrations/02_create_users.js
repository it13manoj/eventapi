"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      contact2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      job: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dob: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM("male", "female", "other"),
        defaultValue: "male",
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sifting_type: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      base_pay: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      insurance: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      adharcard_front: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      adharcard_back: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      insurance_pic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pincode: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      v_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isvarified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isactive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};

