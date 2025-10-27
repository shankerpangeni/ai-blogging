import { Interaction } from "./../models/interaction.models.js";
import { Chat } from "./../models/chat.models.js";
import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

// Helper to call AI model
const callAIModel = async (prompt) => {
  const client = new InferenceClient(process.env.HF_API_KEY);
  const response = await client.chatCompletion({
    model: "deepseek-ai/DeepSeek-V3-0324",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices?.[0]?.message?.content || "No response from AI";
};

// Send message in chat
export const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { prompt } = req.body;
  const userId = req.id;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ success: false, message: "Prompt is required." });
  }

  try {
    // Make sure chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });

    // Save user's message
    const userInteraction = await Interaction.create({
      chat: chatId,
      user: userId,
      role: "user",
      prompt,
    });

    // Call AI
    const aiResponse = await callAIModel(prompt);

    // Save AI response
    const aiInteraction = await Interaction.create({
      chat: chatId,
      user: userId,
      role: "assistant",
      prompt,
      response: aiResponse,
    });

    return res.status(200).json({
      success: true,
      aiResponse,
      interaction: aiInteraction,
    });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ success: false, message: "Failed to send message." });
  }
};
