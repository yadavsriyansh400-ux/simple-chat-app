import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  startConversation,
  sendMessage,
  getMessages,
  getConversations,
  sendConnectionRequest,
  getPendingRequests,
  acceptRequest,
} from "../controllers/chatController.js";

const router = express.Router();

router.post(
  "/start",
  protect,
  startConversation
);

router.post(
  "/send",
  protect,
  sendMessage
);

router.get(
  "/messages/:conversationId",
  protect,
  getMessages
);

router.get(
  "/conversations",
  protect,
  getConversations
);

router.post(
  "/request",
  protect,
  sendConnectionRequest
);

router.get(
  "/requests",
  protect,
  getPendingRequests
);

router.put(
  "/accept/:requestId",
  protect,
  acceptRequest
);

export default router;