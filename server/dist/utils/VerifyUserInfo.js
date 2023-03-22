"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyUserInfo = void 0;
const ExpressError_1 = require("./ExpressError");
const VerifyUserInfo = (user, next) => {
    if (/\d/.test(String(user.fName)) || /\d/.test(String(user.lName))) {
        console.log("Istina");
        return next(new ExpressError_1.ExpressError(`First name and Last name can't contain numbers`, 400));
    }
};
exports.VerifyUserInfo = VerifyUserInfo;
