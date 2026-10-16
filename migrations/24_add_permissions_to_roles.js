"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add description and permissions columns to roles table
    const [cols] = await queryInterface.sequelize.query("DESCRIBE roles;");
    const colNames = cols.map((c) => (c.Field || c.field || "").toLowerCase());

    if (!colNames.includes("description")) {
      await queryInterface.addColumn("roles", "description", {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      });
    }

    if (!colNames.includes("permissions")) {
      await queryInterface.addColumn("roles", "permissions", {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
      });
    }

    // 2. Default Full Permissions for ADMIN
    const adminPermissions = {
      dashboard: { view: true, edit: true },
      calendar: { view: true, edit: true },
      events: { view: true, edit: true },
      templates: { view: true, edit: true },
      employees: { view: true, edit: true },
      roles: { view: true, edit: true },
      attendance: { view: true, edit: true },
      salary: { view: true, edit: true },
      inventory: { view: true, edit: true },
      vehicles: { view: true, edit: true },
      invoices: { view: true, edit: true },
      settings: { view: true, edit: true },
    };

    // Default Permissions for MANAGER
    const managerPermissions = {
      dashboard: { view: true, edit: false },
      calendar: { view: true, edit: true },
      events: { view: true, edit: true },
      templates: { view: true, edit: true },
      employees: { view: true, edit: false },
      roles: { view: false, edit: false },
      attendance: { view: true, edit: true },
      salary: { view: true, edit: false },
      inventory: { view: true, edit: true },
      vehicles: { view: true, edit: true },
      invoices: { view: true, edit: false },
      settings: { view: false, edit: false },
    };

    // Default Permissions for USERS / STAFF
    const staffPermissions = {
      dashboard: { view: false, edit: false },
      calendar: { view: true, edit: false },
      events: { view: true, edit: false },
      templates: { view: false, edit: false },
      employees: { view: false, edit: false },
      roles: { view: false, edit: false },
      attendance: { view: true, edit: false },
      salary: { view: true, edit: false },
      inventory: { view: false, edit: false },
      vehicles: { view: false, edit: false },
      invoices: { view: false, edit: false },
      settings: { view: false, edit: false },
    };

    // 3. Populate default permissions for existing roles
    await queryInterface.sequelize.query(
      `UPDATE roles SET 
        permissions = '${JSON.stringify(adminPermissions)}', 
        description = 'Full system control and administrative access' 
      WHERE UPPER(role_name) = 'ADMIN' OR id = 2;`
    );

    await queryInterface.sequelize.query(
      `UPDATE roles SET 
        permissions = '${JSON.stringify(managerPermissions)}', 
        description = 'Operational management with event, fleet, and inventory control' 
      WHERE UPPER(role_name) = 'MANAGER' OR id = 3;`
    );

    await queryInterface.sequelize.query(
      `UPDATE roles SET 
        permissions = '${JSON.stringify(staffPermissions)}', 
        description = 'Standard employee access for viewing assigned events, attendance, and salary' 
      WHERE UPPER(role_name) IN ('USERS', 'STAFF', 'USER') OR id = 1;`
    );
  },

  down: async (queryInterface, Sequelize) => {
    const [cols] = await queryInterface.sequelize.query("DESCRIBE roles;");
    const colNames = cols.map((c) => (c.Field || c.field || "").toLowerCase());

    if (colNames.includes("permissions")) {
      await queryInterface.removeColumn("roles", "permissions");
    }
    if (colNames.includes("description")) {
      await queryInterface.removeColumn("roles", "description");
    }
  },
};

