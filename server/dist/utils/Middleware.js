"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuth = (req, res, next) => {
    const token = req.cookies.token;
    const frontCookie = req.body.token;
    try {
        const user = jsonwebtoken_1.default.verify(token, "ChuckNorris");
        const reqUser = jsonwebtoken_1.default.verify(frontCookie, "ChuckNorris");
        if (reqUser.email === user.email) {
            return next();
        }
        res.status(403).send("Diffrent users");
    }
    catch (err) {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        return res.status(403).send("User not recognized");
    }
};
exports.userAuth = userAuth;
