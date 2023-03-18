"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
//Database
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
//Auth
const cookieParser = require('cookie-parser');
//Ejs Template dynamic
const ejsMate = require("ejs-mate");
//"mongodb://localhost:27017/jokeApp"
mongoose.connect("mongodb://localhost:27017/jokeApp");
mongoose.connection.on("error", console.error.bind(console, "Connection error"));
mongoose.connection.once("open", () => {
    console.log("Database connected");
});
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('It works!');
});
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message)
        err.message = "Oh No, something went wrong!";
    res.status(statusCode).render("error", { err });
    next();
});
app.listen(3000, () => {
    console.log("Listening on a port 3000");
});
//# sourceMappingURL=index.js.map