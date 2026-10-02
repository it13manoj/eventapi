"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ware_houses", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      capacity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      manager_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gst_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      license_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      google_link: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable("ware_houses");
  },
};

