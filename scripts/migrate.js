require("dotenv").config();
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2/promise");
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config");

async function ensureDatabaseExists() {
  const dbConfig = config.databaseConnection;
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host || "localhost",
      user: dbConfig.username || "root",
      password: dbConfig.password || "",
    });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.end();
  } catch (err) {
    console.warn("Notice during DB check:", err.message);
  }
}

async function getSequelize() {
  await ensureDatabaseExists();
  return require("../db/conenction");
}

async function ensureMetaTable(sequelize) {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.createTable(
    "SequelizeMeta",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    },
    { logging: false }
  );
}

async function getAppliedMigrations(sequelize) {
  await ensureMetaTable(sequelize);
  const [results] = await sequelize.query("SELECT name FROM SequelizeMeta ORDER BY name ASC", {
    logging: false,
  });
  return results.map((r) => r.name);
}

async function recordMigration(sequelize, name) {
  await sequelize.query("INSERT INTO SequelizeMeta (name) VALUES (?)", {
    replacements: [name],
    logging: false,
  });
}

async function removeMigration(sequelize, name) {
  await sequelize.query("DELETE FROM SequelizeMeta WHERE name = ?", {
    replacements: [name],
    logging: false,
  });
}

function getMigrationFiles() {
  const dir = path.join(__dirname, "../migrations");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".js"))
    .sort();
}

async function runUp() {
  const sequelize = await getSequelize();
  const queryInterface = sequelize.getQueryInterface();
  const files = getMigrationFiles();
  const applied = await getAppliedMigrations(sequelize);

  const pending = files.filter((f) => !applied.includes(f));

  if (pending.length === 0) {
    console.log("No pending migrations. Database is up to date.");
    process.exit(0);
  }

  console.log(`Found ${pending.length} pending migration(s):`);
  for (const file of pending) {
    console.log(`\n==> Executing: ${file}`);
    const migration = require(path.join(__dirname, "../migrations", file));
    try {
      await migration.up(queryInterface, Sequelize);
      await recordMigration(sequelize, file);
      console.log(`[SUCCESS] Migrated: ${file}`);
    } catch (err) {
      console.error(`[FAILED] Error in migration ${file}:`, err);
      process.exit(1);
    }
  }

  console.log("\nAll migrations executed successfully!");
  process.exit(0);
}

async function runDown() {
  const sequelize = await getSequelize();
  const queryInterface = sequelize.getQueryInterface();
  const applied = await getAppliedMigrations(sequelize);

  if (applied.length === 0) {
    console.log("No migrations to undo.");
    process.exit(0);
  }

  const lastMigration = applied[applied.length - 1];
  console.log(`\n==> Reverting: ${lastMigration}`);
  const migration = require(path.join(__dirname, "../migrations", lastMigration));

  try {
    await migration.down(queryInterface, Sequelize);
    await removeMigration(sequelize, lastMigration);
    console.log(`[SUCCESS] Reverted: ${lastMigration}`);
  } catch (err) {
    console.error(`[FAILED] Error reverting ${lastMigration}:`, err);
    process.exit(1);
  }

  process.exit(0);
}

async function runStatus() {
  const sequelize = await getSequelize();
  const files = getMigrationFiles();
  const applied = await getAppliedMigrations(sequelize);

  console.log("\n=== Migration Status ===");
  if (files.length === 0) {
    console.log("No migration files found in migrations/ directory.");
  } else {
    for (const f of files) {
      const isApplied = applied.includes(f);
      console.log(`  ${isApplied ? "[APPLIED]" : "[PENDING]"} ${f}`);
    }
  }
  console.log("========================\n");
  process.exit(0);
}

async function runFresh() {
  const sequelize = await getSequelize();
  const queryInterface = sequelize.getQueryInterface();
  console.log("\n==> Dropping all tables...");
  await queryInterface.dropAllTables({ logging: false });
  console.log("[SUCCESS] All tables dropped.");

  console.log("\n==> Re-running all migrations...");
  await runUp();
}

async function runSeed() {
  const sequelize = await getSequelize();
  const seedDir = path.join(__dirname, "../seeders");
  if (!fs.existsSync(seedDir)) {
    console.log("No seeders directory found.");
    process.exit(0);
  }

  const files = fs
    .readdirSync(seedDir)
    .filter((f) => f.endsWith(".js"))
    .sort();

  if (files.length === 0) {
    console.log("No seed files found.");
    process.exit(0);
  }

  const queryInterface = sequelize.getQueryInterface();
  for (const file of files) {
    console.log(`\n==> Seeding: ${file}`);
    const seeder = require(path.join(seedDir, file));
    try {
      await seeder.up(queryInterface, Sequelize);
      console.log(`[SUCCESS] Seeded: ${file}`);
    } catch (err) {
      console.error(`[FAILED] Seeder ${file} error:`, err);
      process.exit(1);
    }
  }

  console.log("\nDatabase seeding completed!");
  process.exit(0);
}

const command = process.argv[2] || "up";

switch (command) {
  case "up":
    runUp();
    break;
  case "down":
  case "undo":
    runDown();
    break;
  case "status":
    runStatus();
    break;
  case "fresh":
    runFresh();
    break;
  case "seed":
    runSeed();
    break;
  default:
    console.log(`Unknown command: ${command}`);
    console.log("Usage: node scripts/migrate.js [up|down|status|fresh|seed]");
    process.exit(1);
}

