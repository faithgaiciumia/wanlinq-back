require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const schema = require("./graphql/schema");
require("./models/db"); // Database connection

const app = express();

const server = new ApolloServer({
  schema,
  formatError: (error) => {
    console.error(error);
    return error;
  },
});

server.start().then(() => {
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: true,
  });

  app.get("/", (req, res) => {
    res.send("Server up and running");
  });

  app.listen(4000, () => {
    console.log("Server running on port 4000");
  });
});