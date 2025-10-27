import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      default: "user",
    },

    prompt: {
      type: String,
      required: true,
    },

    response: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ⚡ Index for efficient message queries
interactionSchema.index({ chat: 1, createdAt: 1 });

export const Interaction = mongoose.model("Interaction", interactionSchema);
