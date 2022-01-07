// import path from "path";
import express from "express";
import { apiCaller, getData } from "./functions/api.js";

const PORT = process.env.PORT || 3001;

const app = express();

// app.use(express.static(path.resolve(__dirname, '../build')));

apiCaller();

app.get("/api", (req, res) => {
  const data = getData();
  res.send({ data });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
