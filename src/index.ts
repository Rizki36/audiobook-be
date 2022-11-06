import express from "express";
import MainRouter from "./resources/router";
import cookieSession from "cookie-session";
import { env } from "process";

const app = express();

app.use(express.json());

app.use(
  cookieSession({
    name: "audiobook",
    secret: env.COOKIE_SECRET,
    httpOnly: true,
  })
);

app.use("/v1", MainRouter);

const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);
