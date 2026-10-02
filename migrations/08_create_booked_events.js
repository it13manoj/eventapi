"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("booked_events", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      categories_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      categories_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subCategories_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      subCategories_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      width: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      height: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      qt: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "events",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      price: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vprice: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hprice: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vertical: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      horizontal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      verticalValue: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verticalPcs: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      verticalUnit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      horizontalValue: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      horizontalPcs: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      horizontalUnit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      evetn_start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      event_end_Date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      stock_id: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      event_stock_id: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("booked_events");
  },
};

