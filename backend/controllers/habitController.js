 
 
import Habit from "../models/Habit.js";


// GET HABITS
export const getHabits = async (req, res) => {
  try {

    const habits = await Habit.find({
      user: req.user._id,
    });

    res.status(200).json(habits);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// CREATE HABIT
export const createHabit = async (req, res) => {
  try {

    const { title, icon, frequency, color } = req.body;

    const habit = await Habit.create({
      user: req.user._id,
      title,
      icon,
      frequency,
      color,
    });

    res.status(201).json(habit);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// TOGGLE HABIT
export const toggleHabit = async (req, res) => {
  try {

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    // Prevent multiple completion in same day
    if (habit.lastCompletedDate === today) {
      return res.status(400).json({
        message: "Habit already completed today",
      });
    }

    // Mark completed
    habit.completedToday = true;

    habit.lastCompletedDate = today;

    // Increase streak
    habit.streak += 1;

    // Update best streak
    if (habit.streak > habit.bestStreak) {
      habit.bestStreak = habit.streak;
    }

    // Save daily history
    habit.dailyHistory.push({
      date: today,
      completed: true,
    });

    await habit.save();

    res.status(200).json(habit);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE HABIT
export const deleteHabit = async (req, res) => {
  try {

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    await habit.deleteOne();

    res.status(200).json({
      message: "Habit deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};
 
