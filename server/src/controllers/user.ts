import { Request, Response } from "express";
import UserModel from "../model/user";
import CatchAsync from "../utils/CatchAsync";
import { User } from "../utils/Interfaces";
import Jwt from "jsonwebtoken";
import Bcrypt from "bcrypt";
import axios from "axios";
import { sendJoke } from "../utils/SendEmail";
import { VerifyUserInfo } from "../utils/VerifyUserInfo";

export const registerUser = CatchAsync(async (req, res) => {
  const user: User = req.body;

  VerifyUserInfo(user, res);

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
});

export const logInUser = CatchAsync(async (req, res) => {
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
    return res.status(404).send("Password or email not recognized, try again.");
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
});

export const getJoke = CatchAsync(async (req, res, next) => {
  try {
    const user = Jwt.verify(req.body.token, "ChuckNorris") as User;

    if (!user.email) {
      return res.status(401).send("Unauthorized");
    }

    const response = await axios.get("https://api.chucknorris.io/jokes/random");

    if (!response.data?.value) {
      return res.status(500).send("Internal server error");
    }

    sendJoke(response.data?.value, user.email);

    return res.status(200).send("Email has been sent");
  } catch (error) {
    return res.status(403).send("User not recognized");
  }
});

export const logoutUser = (req: Request, res: Response) => {
  if (req.body.token) {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.status(200).send("User logged out");
  }
  res.status(500).send("Something went wrong");
};
