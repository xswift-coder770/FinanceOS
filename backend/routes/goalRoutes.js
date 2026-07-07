import express from "express";

import {
  getGoals,
  createGoal,
  addMoneyToGoal,
  deleteGoal,
} from "../controllers/goalController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", protect, getGoals);

router.post("/", protect, createGoal);

router.put("/:id/deposit", protect, addMoneyToGoal);

router.delete("/:id", protect, deleteGoal);


export default router;