"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../model/user"));
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ExpressError_1 = require("../utils/ExpressError");
const Middleware_1 = require("../utils/Middleware");
const axios_1 = __importDefault(require("axios"));
const SendEmail_1 = require("../utils/SendEmail");
const router = express_1.default.Router();
router.get('/register', (req, res) => {
    res.render('Users/Register');
});
router.post('/register', (0, CatchAsync_1.default)(async (req, res, next) => {
    const user = req.body.user;
    const passwordBuffer = Buffer.from(user.password);
    bcrypt_1.default.hash(passwordBuffer, 10, async (err, hash) => {
        if (err) {
            return next(new ExpressError_1.ExpressError(err.message));
        }
        user.password = hash;
        delete user.confirmPassword;
        console.log(user);
        const newUser = new user_1.default(user);
        await newUser.save();
        const token = jsonwebtoken_1.default.sign(user, "ChuckNorris", { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
        });
        res.redirect('/');
    });
}));
router.get("/login", (req, res) => {
    res.render('Users/Login');
});
router.post('/login', (0, CatchAsync_1.default)(async (req, res, next) => {
    const user = req.body.user;
    const foundUser = await user_1.default.findOne({ email: user.email });
    if (!foundUser) {
        return next(new ExpressError_1.ExpressError("User not found", 400));
    }
    const isMatch = await bcrypt_1.default.compare(String(user.password), String(foundUser.password));
    if (!isMatch) {
        return next(new ExpressError_1.ExpressError("Incorrect Password", 400));
    }
    const token = jsonwebtoken_1.default.sign(foundUser.toJSON(), "ChuckNorris", { expiresIn: "1h" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
    });
    res.redirect('/');
}));
router.get('/getJoke', Middleware_1.userAuth, (req, res) => {
    res.render('Users/GetJoke');
});
router.post('/getJoke', Middleware_1.userAuth, (0, CatchAsync_1.default)(async (req, res, next) => {
    const email = String(req.user?.email);
    console.log(email);
    if (!email) {
        return next(new ExpressError_1.ExpressError("Unauthorized", 401));
    }
    const response = await axios_1.default.get('https://api.chucknorris.io/jokes/random');
    (0, SendEmail_1.sendJoke)(response.data?.value, email);
}));
exports.default = router;
