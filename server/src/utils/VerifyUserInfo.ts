import { ExpressError } from "./ExpressError";
import { User } from "./Interfaces";
import { NextFunction } from "express";

export const VerifyUserInfo = (user: User, next: NextFunction) => {
  if (/\d/.test(String(user.fName)) || /\d/.test(String(user.lName))) {
    console.log("Istina");
    return next(
      new ExpressError(`First name and Last name can't contain numbers`, 400)
    );
  }
};
