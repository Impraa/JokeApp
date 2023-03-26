"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.getJoke = exports.logInUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../model/user"));
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const SendEmail_1 = require("../utils/SendEmail");
const VerifyUserInfo_1 = require("../utils/VerifyUserInfo");
exports.registerUser = (0, CatchAsync_1.default)(async (req, res) => {
    const user = req.body;
    (0, VerifyUserInfo_1.VerifyUserInfo)(user, res);
    const passwordBuffer = Buffer.from(user.password);
    bcrypt_1.default.hash(passwordBuffer, 10, async (err, hash) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        user.password = hash;
        delete user.confirmPassword;
        const existingUser = await user_1.default.findOne({ email: user.email });
        if (existingUser) {
            return res.status(409).send("E-mail has to be unique!");
        }
        const newUser = new user_1.default(user);
        await newUser.save();
        const token = jsonwebtoken_1.default.sign(user, "ChuckNorris", { expiresIn: "1h" });
        res
            .cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        })
            .status(200)
            .send(token);
    });
});
exports.logInUser = (0, CatchAsync_1.default)(async (req, res) => {
    const user = req.body;
    const foundUser = await user_1.default.findOne({ email: user.email });
    if (!foundUser) {
        return res.status(404).send("User not found, try again.");
    }
    const isMatch = await bcrypt_1.default.compare(String(user.password), String(foundUser.password));
    if (!isMatch) {
        return res.status(404).send("Password or email not recognized, try again.");
    }
    const token = jsonwebtoken_1.default.sign(foundUser.toJSON(), "ChuckNorris", {
        expiresIn: "1h",
    });
    res
        .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    })
        .status(200)
        .send(token);
});
exports.getJoke = (0, CatchAsync_1.default)(async (req, res, next) => {
    try {
        const user = jsonwebtoken_1.default.verify(req.body.token, "ChuckNorris");
        if (!user.email) {
            return res.status(401).send("Unauthorized");
        }
        const response = await axios_1.default.get("https://api.chucknorris.io/jokes/random");
        if (!response.data?.value) {
            return res.status(500).send("Internal server error");
        }
        (0, SendEmail_1.sendJoke)(response.data?.value, user.email);
        return res.status(200).send("Email has been sent");
    }
    catch (error) {
        return res.status(403).send("User not recognized");
    }
});
const logoutUser = (req, res) => {
    if (req.body.token) {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        return res.status(200).send("User logged out");
    }
    res.status(500).send("Something went wrong");
};
exports.logoutUser = logoutUser;
