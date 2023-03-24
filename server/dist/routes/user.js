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
const Middleware_1 = require("../utils/Middleware");
const VerifyUserInfo_1 = require("../utils/VerifyUserInfo");
const router = express_1.default.Router();
router.get("/register", (req, res) => {
    res.render("Users/Register");
});
router.post("/register", (0, CatchAsync_1.default)(async (req, res, next) => {
    const user = req.body;
    (0, VerifyUserInfo_1.VerifyUserInfo)(user, next);
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
}));
router.get("/login", (req, res) => {
    res.render("Users/Login");
});
router.post("/login", (0, CatchAsync_1.default)(async (req, res, next) => {
    const user = req.body;
    const foundUser = await user_1.default.findOne({ email: user.email });
    if (!foundUser) {
        return res.status(404).send("User not found, try again.");
    }
    const isMatch = await bcrypt_1.default.compare(String(user.password), String(foundUser.password));
    if (!isMatch) {
        return res
            .status(404)
            .send("Password or email not recognized, try again.");
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
}));
router.get("/getJoke", Middleware_1.userAuth, (req, res) => {
    res.render("Users/GetJoke");
});
router.post("/getJoke", Middleware_1.userAuth, (0, CatchAsync_1.default)(async (req, res, next) => {
    const email = String(req.user?.email);
    console.log("Uspio si batice");
    /* if (!email) {
      return next!(new ExpressError("Unauthorized", 401));
    }

    const response = await axios.get("https://api.chucknorris.io/jokes/random");

    if (!response.data?.value) {
      return next!(new ExpressError("Internal server error"));
    }

    sendJoke(response.data?.value, email);

    res.redirect("/getJoke"); */
}));
router.post("/logout", (req, res) => {
    if (req.body.token) {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        return res.status(200).send("User logged out");
    }
    res.status(500).send("Something went wrong");
});
exports.default = router;
