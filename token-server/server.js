import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';
import dealerRouter from './routes/dealer.js';

const app = express();
const PORT = process.env.PORT || 4000;

const mongoClient = new MongoClient(
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@127.0.0.1:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
);
export let db;
mongoClient.connect().then(() => {
  db = mongoClient.db(process.env.MONGO_DB);
});

app.use(express.json());
app.options('*', (_req, res) => res.status(204).end());

app.use('/:dealerId', dealerRouter);

app.listen(PORT, () => {
  console.log(`token-server escuchando en http://localhost:${PORT}`);
});
