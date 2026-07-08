import Expense from "../models/Expense.js";
import Goal from "../models/Goal.js";
import Habit from "../models/Habit.js";

export const getAnalytics = async (req, res) => {
  try {

    const userId = req.user.id;

    const expenses = await Expense.find({ user: userId });

    const goals = await Goal.find({ user: userId });

    const habits = await Habit.find({ user: userId });

    // TOTAL INCOME
    const totalIncome = expenses
      .filter(e => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    // TOTAL EXPENSE
    const totalExpense = expenses
      .filter(e => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);

    const netSavings = totalIncome - totalExpense;

    const savingsRate =
      totalIncome > 0
        ? Math.round((netSavings / totalIncome) * 100)
        : 0;

    // CATEGORY BREAKDOWN
    const categoryMap = {};

    expenses
      .filter(e => e.type === "expense")
      .forEach(e => {
        categoryMap[e.category] =
          (categoryMap[e.category] || 0) + e.amount;
      });

    const colors = {
      Food: "#3b82f6",
      Bills: "#10b981",
      Transport: "#f59e0b",
      Shopping: "#ef4444",
      Health: "#8b5cf6",
      Entertainment: "#06b6d4",
      Other: "#64748b",
    };

    const categorySpend = Object.keys(categoryMap).map(key => ({
      name: key,
      amount: categoryMap[key],
      color: colors[key] || "#64748b",
    }));

    // GOALS
    const goalsProgress = goals.map(goal => ({
      name: goal.title,
      progress: Math.min(
        Math.round((goal.saved / goal.target) * 100),
        100
      ),
      color: "#3b82f6",
    }));

    // HABITS
    const habitPerformance = habits.map(habit => ({
      name: habit.title,
      streak: `${habit.streak} days`,
      progress: Math.min(habit.streak * 10, 100),
      color: habit.color,
      icon: habit.icon,
    }));

//     


// MONTHLY CHART
const monthlyMap = {};

expenses.forEach(expense => {

  const date = new Date(expense.date);

  const monthLabel =
    `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;

  const timestamp =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getTime();

  if (!monthlyMap[monthLabel]) {

    monthlyMap[monthLabel] = {
      month: monthLabel,
      timestamp,
      income: 0,
      expense: 0,
      savings: 0,
    };
  }

  if (expense.type === "income") {

    monthlyMap[monthLabel].income += expense.amount;

  } else {

    monthlyMap[monthLabel].expense += expense.amount;
  }

  monthlyMap[monthLabel].savings =
    monthlyMap[monthLabel].income -
    monthlyMap[monthLabel].expense;
});

const monthlyData = Object.values(monthlyMap)
  .sort(
    (a, b) =>
      a.timestamp - b.timestamp
  )
  .map(({ timestamp, ...rest }) => rest);

 
    const highestCategory =
      categorySpend.length > 0
        ? categorySpend.reduce((a, b) =>
            a.amount > b.amount ? a : b
          )
        : null;

    const longestHabit =
      habits.length > 0
        ? habits.reduce((a, b) =>
            a.streak > b.streak ? a : b
          )
        : null;

    const goalsAbove50 =
      goalsProgress.filter(
        g => g.progress >= 50
      ).length;

    const insights = [
      longestHabit
        ? `🔥 Longest streak: ${longestHabit.streak} days`
        : "🔥 Start your first habit streak",

      highestCategory
        ? `⚠️ Highest spending: ${highestCategory.name}`
        : "⚠️ No spending data yet",

      `🎯 ${goalsAbove50} goals above 50% completion`,

      `💰 Savings rate: ${savingsRate}%`,
    ];

    res.status(200).json({
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,

      monthlyData,

      categorySpend,

      goalsProgress,

      habitPerformance,

      insights,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};