import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/schema.js";
import auth from "./auth/auth.js";
import "./models/db.js"; // Initializes DB connection

dotenv.config();

const app = express();
app.set("trust proxy", true);
app.use("/auth/*", auth);
app.use(cors());

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    user: req.auth?.user || null,
  }),
  formatError: (error) => {
    console.error(error);
    return error;
  },
});

server.start().then(() => {
  server.applyMiddleware({ app, path: "/graphql", cors: true });

  app.get("/", (req, res) => {
    res.send("Server up and running");
  });

  app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
  });
});
