/* eslint-disable no-undef */
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/schema.js";
import auth, { authConfig } from "./auth/auth.js";
import { getSession } from "@auth/express";
import "./models/db.js";

dotenv.config();

const app = express();
app.set("trust proxy", true);


const allowedOrigins = ["http://localhost:5173", "https://quicklinq.netlify.app"];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.use("/auth/*", auth);


app.use(async (req, res, next) => {
  res.locals.session = await getSession(req, authConfig);
  next();
});


const server = new ApolloServer({
  schema,
  context: ({ res }) => {
    const session = res.locals.session;
    return { user: session?.user || null };
  },
  formatError: (error) => {
    console.error(error);
    return error;
  },
});

server.start().then(() => {
  
  server.applyMiddleware({ app, path: "/graphql", cors: false });

  app.get("/", (req, res) => {
    res.send("Server up and running");
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
});
