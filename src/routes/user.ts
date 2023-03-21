import express, { Request, Response } from "express";
import UserModel from "../model/user";
import CatchAsync from "../utils/CatchAsync";
import { User, UserRequest } from "../utils/Interfaces";
import Jwt from "jsonwebtoken";
import Bcrypt from "bcrypt";
import { ExpressError } from "../utils/ExpressError";
import { userAuth } from "../utils/Middleware";
import axios from "axios";
import { sendJoke } from "../utils/SendEmail";

const router = express.Router();

router.get("/register", (req: Request, res: Response) => {
  res.render("Users/Register");
});

router.post(
  "/register",
  CatchAsync(async (req, res, next) => {
    const user: User = req.body.user;

    const passwordBuffer = Buffer.from(user.password);

    Bcrypt.hash(passwordBuffer, 10, async (err, hash) => {
      if (err) {
        return next!(new ExpressError(err.message));
      }

      user.password = hash;

      delete user.confirmPassword;

      console.log(user);
      const newUser = new UserModel(user);
      await newUser.save();

      const token = Jwt.sign(user, "ChuckNorris", { expiresIn: "1h" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
      });
      res.redirect("/");
    });
  })
);

router.get("/login", (req: Request, res: Response) => {
  res.render("Users/Login");
});

router.post(
  "/login",
  CatchAsync(async (req, res, next) => {
    const user: User = req.body.user;

    const foundUser = await UserModel.findOne({ email: user.email });

    if (!foundUser) {
      return next!(new ExpressError("User not found", 400));
    }

    const isMatch = await Bcrypt.compare(
      String(user.password),
      String(foundUser.password)
    );

    if (!isMatch) {
      return next!(new ExpressError("Incorrect Password", 400));
    }

    const token = Jwt.sign(foundUser.toJSON(), "ChuckNorris", {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });
    res.redirect("/");
  })
);

router.get("/getJoke", userAuth, (req: Request, res: Response) => {
  res.render("Users/GetJoke");
});

router.post(
  "/getJoke",
  userAuth,
  CatchAsync(async (req: UserRequest, res, next) => {
    const email: String = String(req.user?.email);

    if (!email) {
      return next!(new ExpressError("Unauthorized", 401));
    }

    const response = await axios.get("https://api.chucknorris.io/jokes/random");

    if (!response.data?.value) {
      return next!(new ExpressError("Internal server error"));
    }

    sendJoke(response.data?.value, email);

    res.redirect("/getJoke");
  })
);

router.post("/logout", (req: Request, res: Response) => {
  if (req.cookies.token) {
    res.clearCookie("token");
    res.redirect("/");
  }
});

export default router;
