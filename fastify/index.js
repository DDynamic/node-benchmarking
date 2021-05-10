const fs = require("fs");
const text = fs.readFileSync("../MOCK_TEXT.txt", "utf8");
const jsonData = require("../MOCK_DATA.json");

// Require the framework and instantiate it
const fastify = require("fastify")();

fastify.register(require("fastify-postgres"), {
  host: "localhost",
  port: 5432,
  database: process.env.PGDATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

// Declare a route
fastify.get("/plaintext", async (request, reply) => {
  return text;
});

fastify.get("/database", async (request, reply) => {
  const client = await fastify.pg.connect();
  const { rows } = await client.query("SELECT * FROM books");
  client.release();
  return rows.map((row) => `${row.id}, ${row.title}, ${row.author}`).join("\n");
});

fastify.get("/json", async (request, reply) => {
  return jsonData;
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
    console.log("Fastify server running");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
