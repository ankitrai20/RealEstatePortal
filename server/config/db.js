const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: isProduction
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

pool
  .connect()
  .then((client) => {
    console.log("✅ PostgreSQL Connected Successfully");
    client.release();
  })
  .catch((err) => {
    console.log("❌ PostgreSQL Connection Failed");
    console.log(err.message);
  });

module.exports = pool;