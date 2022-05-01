const { Service } = require("node-windows");
const path = require("path");

const server = new Service({
  name: "Brist System NodeJs Server",
  description: "This service Starts the Nodejs server",
  script: path.join(__dirname, "/dist/src/index.js"),
  env: [
    { name: "DB_PASSWORD", value: "kranuaonpostgres" },
    { name: "NODE_ENV", value: "production" },
    { name: "REFRESH_TOKEN_SECRET", value: "refresh" },
    { name: "ACCESS_TOKEN_SECRET", value: "access" },
  ],
});
const client = new Service({
  name: "Brist System ReactJs Server",
  description: "This service Starts the react serve-handler",
  script: path.join(__dirname, "../client/serve.js"),
});

server.on("install", function () {
  server.start();
});
client.on("install", function () {
  client.start();
});

server.install();
client.install();
