"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Roles
    const [roles] = await queryInterface.sequelize.query("SELECT id FROM roles WHERE id = 1");
    if (!roles || roles.length === 0) {
      await queryInterface.bulkInsert("roles", [
        { id: 1, role_name: "Admin", created_at: new Date(), updated_at: new Date() },
        { id: 2, role_name: "Manager", created_at: new Date(), updated_at: new Date() },
        { id: 3, role_name: "Staff", created_at: new Date(), updated_at: new Date() },
        { id: 4, role_name: "Driver", created_at: new Date(), updated_at: new Date() },
      ]);
    }

    // 2. Default Admin User
    const [users] = await queryInterface.sequelize.query("SELECT id FROM users WHERE email = 'admin@gmail.com'");
    if (!users || users.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await queryInterface.bulkInsert("users", [
        {
          name: "Admin User",
          contact: "9999999999",
          email: "admin@gmail.com",
          password: hashedPassword,
          role_id: 1,
          isactive: true,
          isvarified: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }

    // 3. Company
    const [companies] = await queryInterface.sequelize.query("SELECT id FROM Companies WHERE id = 1");
    if (!companies || companies.length === 0) {
      await queryInterface.bulkInsert("Companies", [
        {
          id: 1,
          companyName: "ABC Event Management",
          email: "info@abcevents.com",
          phone: "+91 9876543210",
          website: "www.abcevents.com",
          address: "Patna, Bihar, India",
          gstNumber: "10ABCDE1234F1Z5",
          foundedYear: 2018,
          totalEvents: 250,
          teamMembers: 35,
          aboutCompany:
            "ABC Event Management specializes in weddings, corporate events, birthday parties, cultural programs, and large-scale event planning across India.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // 4. Default Vehicle Types
    const [vehicleTypes] = await queryInterface.sequelize.query("SELECT id FROM vehicle_type WHERE id = 1");
    if (!vehicleTypes || vehicleTypes.length === 0) {
      await queryInterface.bulkInsert("vehicle_type", [
        {
          id: 1,
          name: "Small Pickup",
          wheel: 4,
          capacity: 1,
          description: "Small pickup for light gear",
          fuel_type: "diesel",
          isActive: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: "Medium Truck",
          wheel: 6,
          capacity: 5,
          description: "Medium truck for truss and stage items",
          fuel_type: "diesel",
          isActive: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // optional rollback
  },
};

