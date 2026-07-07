import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: "🎯",
    },

    saved: {
      type: Number,
      default: 0,
    },

    target: {
      type: Number,
      required: true,
    },

    deadline: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;