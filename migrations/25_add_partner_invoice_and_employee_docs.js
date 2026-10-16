"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add employee document numbers to users table
    const userTable = await queryInterface.describeTable("users");
    if (!userTable.adharcard_number) {
      await queryInterface.addColumn("users", "adharcard_number", {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      });
    }
    if (!userTable.insurance_number) {
      await queryInterface.addColumn("users", "insurance_number", {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      });
    }

    // 2. Add partner and invoice details to events table
    const eventTable = await queryInterface.describeTable("events");
    if (!eventTable.partner_name) {
      await queryInterface.addColumn("events", "partner_name", {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      });
    }
    if (!eventTable.partner_gst) {
      await queryInterface.addColumn("events", "partner_gst", {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      });
    }
    if (!eventTable.partner_phone) {
      await queryInterface.addColumn("events", "partner_phone", {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      });
    }
    if (!eventTable.partner_address) {
      await queryInterface.addColumn("events", "partner_address", {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      });
    }
    if (!eventTable.invoice_notes) {
      await queryInterface.addColumn("events", "invoice_notes", {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      });
    }
    if (!eventTable.gst_rate) {
      await queryInterface.addColumn("events", "gst_rate", {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "adharcard_number");
    await queryInterface.removeColumn("users", "insurance_number");
    await queryInterface.removeColumn("events", "partner_name");
    await queryInterface.removeColumn("events", "partner_gst");
    await queryInterface.removeColumn("events", "partner_phone");
    await queryInterface.removeColumn("events", "partner_address");
    await queryInterface.removeColumn("events", "invoice_notes");
    await queryInterface.removeColumn("events", "gst_rate");
  },
};

