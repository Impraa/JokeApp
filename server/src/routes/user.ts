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
import { VerifyUserInfo } from "../utils/VerifyUserInfo";
import cookiesMiddleware from "universal-cookie-express";

const router = express.Router();

router.get("/register", (req: Request, res: Response) => {
  res.render("Users/Register");
});

router.post(
  "/register",
  CatchAsync(async (req, res, next) => {
    const user: User = req.body;

    VerifyUserInfo(user, next!);

    const passwordBuffer = Buffer.from(user.password);

    Bcrypt.hash(passwordBuffer, 10, async (err, hash) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      user.password = hash;

      delete user.confirmPassword;

      const existingUser = await UserModel.findOne({ email: user.email });

      if (existingUser) {
        return res.status(409).send("E-mail has to be unique!");
      }

      const newUser = new UserModel(user);
      await newUser.save();

      const token = Jwt.sign(user, "ChuckNorris", { expiresIn: "1h" });

      res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .status(200)
        .send(token);
    });
  })
);

router.get("/login", (req: Request, res: Response) => {
  res.render("Users/Login");
});

router.post(
  "/login",
  CatchAsync(async (req, res, next) => {
    const user: User = req.body;

    const foundUser = await UserModel.findOne({ email: user.email });

    if (!foundUser) {
      return res.status(404).send("User not found, try again.");
    }

    const isMatch = await Bcrypt.compare(
      String(user.password),
      String(foundUser.password)
    );

    if (!isMatch) {
      return res
        .status(404)
        .send("Password or email not recognized, try again.");
    }

    const token = Jwt.sign(foundUser.toJSON(), "ChuckNorris", {
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
  })
);

router.post("/logout", (req: Request, res: Response) => {
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

export default router;
