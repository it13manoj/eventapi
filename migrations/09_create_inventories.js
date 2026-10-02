"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("inventories", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      width: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      height: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      quality: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      missing: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      bad: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      good: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      vertical_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      horizontal_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      have_size: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      categories_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      sub_categories_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "subcategories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      ware_house_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "ware_houses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.dropTable("inventories");
  },
};

