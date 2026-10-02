"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Companies", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      gstNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      foundedYear: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      totalEvents: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      teamMembers: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      aboutCompany: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Companies");
  },
};

