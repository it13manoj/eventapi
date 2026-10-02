"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("vehicle_movements", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("OWNER", "AGENT"),
        allowNull: false,
      },
      agent_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehicle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fuel_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fuel_quantity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fuel_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      loading_datetime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      loading_location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      loading_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unloading_datetime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      unloading_location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unloading_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      event_loading_datetime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      event_loading_location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      event_loading_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      event_unloading_datetime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      event_unloading_location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      event_unloading_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "ASSIGNED",
          "LOADING",
          "IN_TRANSIT_TO_EVENT",
          "EVENT_UNLOADING",
          "AT_EVENT",
          "EVENT_LOADING",
          "IN_TRANSIT_TO_WAREHOUSE",
          "UNLOADING",
          "COMPLETED"
        ),
        defaultValue: "ASSIGNED",
        allowNull: false,
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
    await queryInterface.dropTable("vehicle_movements");
  },
};

