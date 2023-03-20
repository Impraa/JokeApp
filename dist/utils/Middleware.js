"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ExpressError_1 = require("./ExpressError");
const userAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const user = jsonwebtoken_1.default.verify(token, "ChuckNorris");
        req.user = user;
        next();
    }
    catch (err) {
        res.clearCookie('token');
        return next(new ExpressError_1.ExpressError('User not recognized', 403));
    }
};
exports.userAuth = userAuth;
