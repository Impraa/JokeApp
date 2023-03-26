//Basics
import { Request, Response, NextFunction } from "express";
import express from "express";

//Database
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";

//Auth
import cookieParser from "cookie-parser";
import user from "./routes/user";

import cors from "cors";

const app = express();

//"mongodb://localhost:27017/jokeApp"

mongoose.connect("mongodb://localhost:27017/jokeApp");

mongoose.connection.on(
  "error",
  console.error.bind(console, "Connection error")
);
mongoose.connection.once("open", () => {
  console.log("Database connected");
});

app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cookieParser("ChuckNorris"));
app.use("/", user);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Method not found");
});

app.listen(3000, () => {
  console.log("Listening on a port 3000");
});
