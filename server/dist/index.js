"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
const ExpressError_js_1 = require("./utils/ExpressError.js");
//Database
const mongoose_1 = __importDefault(require("mongoose"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
//Auth
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = __importDefault(require("./routes/user"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Ejs Template dynamic
const ejsMate = require("ejs-mate");
const app = (0, express_1.default)();
//"mongodb://localhost:27017/jokeApp"
mongoose_1.default.connect("mongodb://localhost:27017/jokeApp");
mongoose_1.default.connection.on("error", console.error.bind(console, "Connection error"));
mongoose_1.default.connection.once("open", () => {
    console.log("Database connected");
});
app.use((0, cors_1.default)({
    origin: "http://127.0.0.1:5173",
    credentials: true,
}));
app.engine("ejs", ejsMate);
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, method_override_1.default)("_method"));
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, cookie_parser_1.default)("ChuckNorris"));
app.use((req, res, next) => {
    res.locals.currentUser = "";
    if (req.cookies.token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(req.cookies.token, "ChuckNorris");
            res.locals.currentUser = decoded;
        }
        catch (error) {
            res.clearCookie("token");
            return next(new ExpressError_js_1.ExpressError("User not recognized", 403));
        }
    }
    next();
});
app.use("/", user_1.default);
app.get("/", (req, res) => {
    res.render("Homepage");
});
app.all("*", (req, res, next) => {
    next(new ExpressError_js_1.ExpressError("Page not found", 404));
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
