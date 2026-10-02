"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("events", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      design_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "designs",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      c_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vanus: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      doe: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      v_location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      v_a_d: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nodb: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      pob: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tc: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sr: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "0",
        allowNull: true,
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
      width: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      height: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quntites: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      team_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
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
    await queryInterface.dropTable("events");
  },
};

