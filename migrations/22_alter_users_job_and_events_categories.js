"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Modify users table: change job and dob from datetime to VARCHAR(255)
    await queryInterface.changeColumn("users", "job", {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.changeColumn("users", "dob", {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    });

    // 2. Modify events table: make categories_id and sub_categories_id nullable
    await queryInterface.changeColumn("events", "categories_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.changeColumn("events", "sub_categories_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "job", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.changeColumn("users", "dob", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.changeColumn("events", "categories_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("events", "sub_categories_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};

