require('dotenv').config();
const sequelize = require('../db/conenction');

async function run() {
  const [activeEvents] = await sequelize.query(`
    SELECT id, c_name, status, template_id, template_name, doe, nodb 
    FROM events 
    WHERE status NOT IN ('3', '4', 'Finished', 'Event Finished', 'Complete', 'Completed', 'Cancelled', 'Cancelled/Postpone')
  `);
  console.log('Active uncompleted events:', JSON.stringify(activeEvents, null, 2));

  const [activeBooked] = await sequelize.query(`
    SELECT be.id, be.event_id, be.categories_id, be.subCategories_id, be.qt, 
           be.vertical, be.verticalValue, be.verticalPcs, 
           be.horizontal, be.horizontalValue, be.horizontalPcs, 
           be.stock_id, be.st_qt, e.status as event_status
    FROM booked_events be
    JOIN events e ON e.id = be.event_id
    WHERE e.status NOT IN ('3', '4', 'Finished', 'Event Finished', 'Complete', 'Completed', 'Cancelled', 'Cancelled/Postpone')
  `);
  console.log('Booked items in active events:', JSON.stringify(activeBooked, null, 2));
  process.exit(0);
}

run();

