import express from "express";
import {
  createChat,
  getUserChats,
  getChatById,
 
  deleteChat,
} from "./../controllers/chat.controller.js";

import { isAuthenticated } from "./../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, createChat);
router.get("/", isAuthenticated, getUserChats);
router.get("/:chatId", isAuthenticated, getChatById);

router.delete("/:chatId", isAuthenticated, deleteChat);

export default router;
