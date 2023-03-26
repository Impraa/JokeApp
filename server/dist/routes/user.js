"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Middleware_1 = require("../utils/Middleware");
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
router.post("/register", user_1.registerUser);
router.post("/login", user_1.logInUser);
router.post("/getJoke", Middleware_1.userAuth, user_1.getJoke);
router.post("/logout", user_1.logoutUser);
exports.default = router;
