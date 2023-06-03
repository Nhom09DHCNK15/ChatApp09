const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const { s3Uploadv3, s3Uploadv2 } = require("../config/aws");

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  let { content } = req.body;
  const { chatId } = req.body;
  let type = "text";
  if (!chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let newMessage;

  if (req.files) {
    const results = await s3Uploadv2(req.files);
    newMessage = results.map((r) => {
      content = r.Location;
      let typeFile = r.key.split(".").at(-1);
      if (typeFile == 'png' || typeFile == 'jpg' || typeFile == 'jpeg') {
        type = "image";
      } else {
        type = "document";
      }
      return {
        sender: req.user._id,
        content,
        chat: chatId,
        type
      }
    });
  } else {
    newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
      type: type
    };
  }


  try {
    if (Array.isArray(newMessage)) {
      let data = []
      for (const mes of newMessage) {
        let message = await Message.create(mes);

        message = await message.populate("sender", "name pic").execPopulate();
        message = await message.populate("chat").execPopulate();
        message = await User.populate(message, {
          path: "chat.users",
          select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        data.push(message);
      }
      res.json(data);
    } else {
      let message = await Message.create(newMessage);

      message = await message.populate("sender", "name pic").execPopulate();
      message = await message.populate("chat").execPopulate();
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });

      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
      res.json(message);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
