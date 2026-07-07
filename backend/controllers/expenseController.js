import Expense from "../models/Expense.js";


// ADD EXPENSE
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date } = req.body;

const selectedDate = new Date(date);

const today = new Date();

today.setHours(23, 59, 59, 999);

if (selectedDate > today) {
  return res.status(400).json({
    message: "Future dates are not allowed",
  });
}

const expense = await Expense.create({
  title,
  amount,
  category,
  type,
  date,
  user: req.user.id,
});
    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ALL EXPENSES
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(expenses);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE EXPENSE
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      message: "Expense deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};