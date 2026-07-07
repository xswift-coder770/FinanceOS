import express from "express";

import {
  getHabits,
  createHabit,
  toggleHabit,
  deleteHabit,
} from "../controllers/habitController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getHabits);

router.post("/", protect, createHabit);

router.put("/:id/toggle", protect, toggleHabit);

router.delete("/:id", protect, deleteHabit);

export default router;