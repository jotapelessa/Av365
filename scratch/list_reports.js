const { Client } = require('pg');
require('dotenv').config();

async function listFeedback() {
  console.log("Connecting to:", process.env.DIRECT_URL ? "URL defined" : "URL UNDEFINED");
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query('SELECT * FROM "UIFeedback" ORDER BY "createdAt" DESC LIMIT 10');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error("FULL ERROR:", err);
  } finally {
    await client.end();
  }
}

listFeedback();
