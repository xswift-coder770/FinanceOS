// backend/routes/authroutes.js

import express from "express";
import {
  register,
  login,
  getMe,
} from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation,
} from "../validations/authValidation.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", protect, getMe);

export default router;