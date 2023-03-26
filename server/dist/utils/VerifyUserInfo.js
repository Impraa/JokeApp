"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyUserInfo = void 0;
const VerifyUserInfo = (user, res) => {
    if (/\d/.test(String(user.fName)) || /\d/.test(String(user.lName))) {
        return res
            .status(400)
            .send(`First name and Last name can't contain numbers`);
    }
    else if (!user.email.includes("@")) {
        return res.status(400).send(`Please provide a valid email`);
    }
    else if (user.password !== user.confirmPassword) {
        return res.status(400).send(`Passwords are not matching`);
    }
};
exports.VerifyUserInfo = VerifyUserInfo;
