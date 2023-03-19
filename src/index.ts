//Basics
import { Request, Response, NextFunction } from "express";
import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import { ExpressError } from './utils/ExpressError.js';

//Database
import mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';

//Auth
import cookieParser from 'cookie-parser';
import user from "./routes/user";

//Ejs Template dynamic
const ejsMate = require('ejs-mate');

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


app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());
app.use(cookieParser());

app.use("/", user);

app.get('/', (req:Request, res:Response) => { 
    res.render('Homepage');
})

app.all("*", (req:Request, res:Response, next:NextFunction) => {
    next(new ExpressError("Page not found", 404));
  });

  app.use((err:any, req:Request, res:Response, next:NextFunction) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, something went wrong!";
    res.status(statusCode).render("error", { err });
    next();
  });

app.listen(3000,() => {
    console.log("Listening on a port 3000")
})