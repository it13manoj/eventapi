"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Modify events table: change status column from ENUM to VARCHAR(50)
    await queryInterface.changeColumn("events", "status", {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: "0",
    });

    // 2. Migrate existing status codes in events table safely:
    // Old:
    // '0' -> Enquiry
    // '1' -> Confirm/Live  => now '1' (Confirm)
    // '2' -> Installation Ongoing => now '2' (Installation)
    // '3' -> Event Finished => now '4' (Event Finished)
    // '4' -> Cancelled/Postpone => now '5' (Cancelled)
    await queryInterface.sequelize.query(
      "UPDATE events SET status = '5' WHERE status IN ('4', 'Cancelled', 'Cancelled/Postpone');"
    );
    await queryInterface.sequelize.query(
      "UPDATE events SET status = '4' WHERE status IN ('3', 'Finished', 'Event Finished', 'Complete', 'Completed');"
    );

    // 3. Add status column to booked_events if it does not exist
    const [beCols] = await queryInterface.sequelize.query("DESCRIBE booked_events;");
    const hasStatus = beCols.some(
      (c) => (c.Field || c.field || "").toLowerCase() === "status"
    );
    if (!hasStatus) {
      await queryInterface.addColumn("booked_events", "status", {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: "0",
      });
    }

    // 4. Synchronize booked_events.status with events.status
    await queryInterface.sequelize.query(
      "UPDATE booked_events be INNER JOIN events e ON be.event_id = e.id SET be.status = e.status;"
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Revert status mapping if rolling back
    await queryInterface.sequelize.query(
      "UPDATE events SET status = '3' WHERE status = '4';"
    );
    await queryInterface.sequelize.query(
      "UPDATE events SET status = '4' WHERE status IN ('5', '6');"
    );

    await queryInterface.changeColumn("events", "status", {
      type: Sequelize.ENUM("0", "1", "2", "3", "4"),
      allowNull: true,
      defaultValue: "0",
    });

    // Remove status from booked_events if added
    const [beCols] = await queryInterface.sequelize.query("DESCRIBE booked_events;");
    const hasStatus = beCols.some(
      (c) => (c.Field || c.field || "").toLowerCase() === "status"
    );
    if (hasStatus) {
      await queryInterface.removeColumn("booked_events", "status");
    }
  },
};

