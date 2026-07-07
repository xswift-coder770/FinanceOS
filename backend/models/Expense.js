 


import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,

      required: true,

      enum: [
        "Food",
        "Bills",
        "Transport",
        "Shopping",
        "Health",
        "Entertainment",

        "Salary",
        "Freelance",
        "Investment",

        "Other",
      ],
    },

    type: {
      type: String,

      enum: [
        "expense",
        "income",
      ],

      default: "expense",
    },

    date: {
      type: Date,

      default: Date.now,
    },

    user: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Expense = mongoose.model(
  "Expense",
  expenseSchema
);


export default Expense;