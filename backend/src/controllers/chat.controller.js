import { Chat } from "./../models/chat.models.js";
import { Interaction } from "./../models/interaction.models.js";

// 1️⃣ Create a new chat
export const createChat = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.id; // assuming auth middleware sets req.id

    const chat = await Chat.create({
      user: userId,
      title: title || "New Chat",
    });

    return res.status(201).json({
      success: true,
      message: "Chat created successfully",
      chat,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 2️⃣ Get all chats for a user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.id;

    const chats = await Chat.find({ user: userId })
      .sort({ updatedAt: -1 })
      .select("title updatedAt");

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3️⃣ Get a specific chat with interactions
export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId).populate({
      path: "interactions",
      options: { sort: { createdAt: 1 } },
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    return res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 4️⃣ Delete a chat and its messages
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.id;

    const chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    await Interaction.deleteMany({ chat: chat._id });
    await chat.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
