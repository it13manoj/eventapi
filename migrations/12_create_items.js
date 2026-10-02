"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("items", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ft: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      qt: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      height: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      width: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      categories_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sub_categories_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      stock_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("items");
  },
};

