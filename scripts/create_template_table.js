require('dotenv').config();
const sequelize = require('../db/conenction');

async function migrate() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS event_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        description TEXT NULL,
        items JSON NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('event_templates table created or exists successfully');

    try {
      await sequelize.query('ALTER TABLE events ADD COLUMN template_id INT NULL');
      console.log('template_id added to events table');
    } catch (err) {
      console.log('template_id column info:', err.message);
    }

    try {
      await sequelize.query('ALTER TABLE events ADD COLUMN template_name VARCHAR(255) NULL');
      console.log('template_name added to events table');
    } catch (err) {
      console.log('template_name column info:', err.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();

