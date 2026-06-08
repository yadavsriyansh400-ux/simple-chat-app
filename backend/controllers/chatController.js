import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import ConnectionRequest from "../models/ConnectionRequest.js";
import { getIo } from "../socket.js";

export const startConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    const currentUserId = req.user._id;

    let conversation =
      await Conversation.findOne({
        participants: {
          $all: [currentUserId, userId],
        },
      });

    if (conversation) {
      return res.json(conversation);
    }

    conversation =
      await Conversation.create({
        participants: [
          currentUserId,
          userId,
        ],
      });

    res.status(201).json(conversation);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      text,
    });

    const populatedMessage =
      await Message.findById(message._id)
        .populate("sender", "username email");

    const io = getIo();

    io.to(conversationId).emit(
      "receiveMessage",
      populatedMessage
    );

    res.status(201).json(populatedMessage);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversationId,
    })
      .populate("sender", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    }).populate(
      "participants",
      "username email"
    );

    res.json(conversations);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver ID is required",
      });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({
        message: "You cannot send request to yourself",
      });
    }

    const existingRequest =
      await ConnectionRequest.findOne({
        sender: req.user.id,
        receiver: receiverId,
      });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    const request =
      await ConnectionRequest.create({
        sender: req.user.id,
        receiver: receiverId,
      });

    res.status(201).json({
      message: "Connection request sent",
      request,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests =
      await ConnectionRequest.find({
        receiver: req.user.id,
        status: "pending",
      }).populate(
        "sender",
        "username email"
      );

    res.json(requests);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await ConnectionRequest.findById(
      requestId
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    request.status = "accepted";

    await request.save();

    const conversation = await Conversation.create({
      participants: [
        request.sender,
        request.receiver,
      ],
    });

    res.json({
      message: "Request accepted",
      conversation,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};