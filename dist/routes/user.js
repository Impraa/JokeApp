"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const router = express_1.default.Router();
router.get('/register', (req, res) => {
    res.render('Users/Register');
});
router.post('/register', (0, CatchAsync_1.default)(async (req, res) => {
    const user = req.body.user;
    console.log(user);
}));
exports.default = router;
