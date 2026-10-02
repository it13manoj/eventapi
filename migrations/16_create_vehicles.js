"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("vehicles", {
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
      vehicle_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vehicle_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vehicle_type",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      owner_agency: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      driver_contact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ownershiptype: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      load_capacity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      commission: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      insurance: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "1",
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
    await queryInterface.dropTable("vehicles");
  },
};

