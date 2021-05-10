const express = require("express");
const fs = require("fs");
const pgp = require("pg-promise")();

const app = express();

const db = pgp({
  host: "localhost",
  port: 5432,
  database: process.env.PGDATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

const text = fs.readFileSync("../MOCK_TEXT.txt", "utf8");
const jsonData = require("../MOCK_DATA.json");

app.get("/plaintext", (req, res) => {
  res.set("Content-Type", "text/plain").send(text);
});

app.get("/database", (req, res) => {
  db.result("SELECT * FROM books").then(function (data) {
    res
      .set("Content-Type", "text/plain")
      .send(
        data.rows
          .map((row) => `${row.id}, ${row.title}, ${row.author}`)
          .join("\n")
      );
  });
});

app.get("/json", (req, res) => {
  res.send(jsonData);
});

app.listen(3000, () => {
  console.log(`Express server running`);
});
