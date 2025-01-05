import express from "express";
import dotenv from "dotenv";
import { db } from "./db/index.js";

dotenv.config();

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const result = await db.query(`SELECT * from bolge;`);
  console.log(result);

  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
