import Expense from "../models/Expense.js";
import Goal from "../models/Goal.js"; //now

export const getDashboardData = async (req, res) => {

  try {

    const expenses = await Expense.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

 //goals ko yaha fetch kar rhe 
 const goals = await Goal.find({
  user: req.user.id,
});



const totalGoalAmount = goals.reduce(
  (sum, goal) => sum + goal.targetAmount,
  0
);

const savedAmount = goals.reduce(
  (sum, goal) => sum + goal.currentAmount,
  0
);


const activeGoals = goals.length;
    // TOTAL EXPENSES
    const totalExpenses = expenses
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => acc + item.amount, 0);


    // TOTAL INCOME
    const totalIncome = expenses
      .filter((item) => item.type === "income")
      .reduce((acc, item) => acc + item.amount, 0);


    // SAVINGS
    const totalSavings =
      totalIncome - totalExpenses;


    // SAVINGS RATE
    const savingsRate =
      totalIncome > 0
        ? Math.round(
            (totalSavings / totalIncome) * 100
          )
        : 0;


    // RECENT TRANSACTIONS
    const recentTransactions =
      expenses.slice(0, 5);


    // CATEGORY BREAKDOWN
    const categoryMap = {};

    expenses.forEach((item) => {

      if (item.type === "expense") {

        if (!categoryMap[item.category]) {
          categoryMap[item.category] = 0;
        }

        categoryMap[item.category] += item.amount;
      }
    });


    const budgetProgress =
      Object.entries(categoryMap).map(
        ([category, amount]) => ({
          category,

          percentage:
            totalExpenses > 0
              ? Math.round(
                  (amount / totalExpenses) * 100
                )
              : 0,
        })
      );


    res.status(200).json({
      totalIncome,
      totalExpenses,
      totalSavings,
      savingsRate,

      // activeGoals: 4,
      activeGoals,
        totalGoalAmount,
  savedAmount,

      recentTransactions,

      budgetProgress,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};