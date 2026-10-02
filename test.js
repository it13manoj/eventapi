require("dotenv").config();

const mysql = require("mysql2/promise");

console.log({
	host: process.env.HOST,
      user: process.env.USER_NAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,


});


(async () => {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'events',
      password: 'events',
      database: 'events',
    });

    console.log("✅ MySQL Connected");
    await conn.end();
  } catch (err) {
    console.error(err);
  }
})();
