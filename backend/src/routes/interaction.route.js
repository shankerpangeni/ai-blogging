import express from "express";
import { sendMessage } from "./../controllers/interaction.controller.js";

import { isAuthenticated } from "./../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/:chatId/message", isAuthenticated, sendMessage);

export default router;
