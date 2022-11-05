import express from "express";
import MainRouter from "./resources/router";

const app = express();

app.use(express.json());

app.use("/v1", MainRouter);

const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);
