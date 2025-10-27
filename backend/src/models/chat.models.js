import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "New Chat",
    },

    systemPrompt: {
      type: String,
      default: "You are a helpful assistant.",
    },

    interactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interaction",
      },
    ],
  },
  { timestamps: true }
);

// ⚡ Index for faster chat retrieval by user
chatSchema.index({ user: 1, updatedAt: -1 });

export const Chat = mongoose.model("Chat", chatSchema);
