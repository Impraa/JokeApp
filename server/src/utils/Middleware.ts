import { Response, NextFunction } from "express";

import Jwt from "jsonwebtoken";
import { User, UserRequest } from "./Interfaces";

export const userAuth = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  const frontCookie = req.body.token;

  try {
    const user = Jwt.verify(token, "ChuckNorris") as User;
    const reqUser = Jwt.verify(frontCookie, "ChuckNorris") as User;
    if (reqUser.email === user.email) {
      return next();
    }
    res.status(403).send("Diffrent users");
  } catch (err) {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.status(403).send("User not recognized");
  }
};
