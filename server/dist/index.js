"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//Database
const mongoose_1 = __importDefault(require("mongoose"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
//Auth
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = __importDefault(require("./routes/user"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
//"mongodb://localhost:27017/jokeApp"
mongoose_1.default.connect("mongodb://localhost:27017/jokeApp");
mongoose_1.default.connection.on("error", console.error.bind(console, "Connection error"));
mongoose_1.default.connection.once("open", () => {
    console.log("Database connected");
});
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://127.0.0.1:5173",
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, cookie_parser_1.default)("ChuckNorris"));
app.use("/", user_1.default);
app.all("*", (req, res, next) => {
    res.status(404).send("Method not found");
});
app.listen(3000, () => {
    console.log("Listening on a port 3000");
});
