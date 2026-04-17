import "dotenv/config";
import express from "express";
import { MongoClient } from "mongodb";
import dealerRouter from "./routes/dealer.js";

const app = express();
const PORT = process.env.PORT || 4000;

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

export async function connectDB() {
  await mongoClient.connect();
  db = mongoClient.db();
  return db;
}

export function getDB() {
  if (!db) throw new Error("DB not connected.");
  return db;
}

mongoClient
  .connect()
  .then(() => {
    db = mongoClient.db(process.env.MONGO_DB);
  })
  .catch((err) => {
    console.error("Mongo connection failed", err);
    process.exit(1);
  });

app.use(express.json());
app.options("*", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(204).end();
});

app.use("/:dealerId", dealerRouter);

app.listen(PORT, () => {
  console.log(`token-server escuchando en http://localhost:${PORT}`);
});
