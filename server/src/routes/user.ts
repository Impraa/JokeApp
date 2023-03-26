import express from "express";
import { userAuth } from "../utils/Middleware";
import {
  getJoke,
  logInUser,
  logoutUser,
  registerUser,
} from "../controllers/user";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", logInUser);

router.post("/getJoke", userAuth, getJoke);

router.post("/logout", logoutUser);

export default router;
