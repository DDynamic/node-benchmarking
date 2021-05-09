const http = require("http");
const fs = require("fs");
const { Pool } = require("pg");
const pool = new Pool();

const text = fs.readFileSync("../MOCK_TEXT.txt", "utf8");
const jsonData = require("../MOCK_DATA.json");

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  switch (req.url) {
    case "/plaintext":
      res.setHeader("Content-Type", "text/plain");
      res.end(text);
      break;
    case "/database":
      res.setHeader("Content-Type", "text/plain");
      pool.connect((err, client, done) => {
        client.query("SELECT * FROM books", (err, { rows }) => {
          res.end(
            rows
              .map((row) => `${row.id}, ${row.title}, ${row.author}`)
              .join("\n")
          );
          done();
        });
      });
      break;
    case "/json":
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(jsonData));
      break;
  }
});

server.listen(3000, "0.0.0.0", () => {
  console.log(`Vanilla server running`);
});
