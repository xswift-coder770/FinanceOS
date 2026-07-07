import Goal from "../models/Goal.js";


// GET ALL GOALS
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });

    res.status(200).json(goals);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// CREATE GOAL
export const createGoal = async (req, res) => {
  try {

    const { title, icon, saved, target, deadline } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      title,
      icon,
      saved,
      target,
      deadline,
    });

    res.status(201).json(goal);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ADD MONEY
export const addMoneyToGoal = async (req, res) => {
  try {

    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    const amount = Number(req.body.amount);

    goal.saved = Math.min(goal.target, goal.saved + amount);

    await goal.save();

    res.status(200).json(goal);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// DELETE GOAL
export const deleteGoal = async (req, res) => {
  try {

    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      message: "Goal deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};