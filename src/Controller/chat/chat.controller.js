import mongoose from "mongoose";
import conversationModel from "../../Model/Chat/conversation.model.js";
import messageModel from "../../Model/Chat/message.model.js";
import seenModel from "../../Model/Chat/seen.model.js";

// Define the msgHandler function
export const onlineUser = new Map();
export const msgHandler = async (io, socket) => {
  // create a room
  try {
    const user = socket.handshake.user;
    onlineUser.set(user?._id?.toString(), socket);
    const conversations = await conversationModel.find({
      members: { $in: [user._id] },
    });
    if (conversations) {
      for (const conversation of conversations) {
        socket.join(conversation._id.toString());
      }
    }
    // Listen for messages from the client
    socket.on("sendMessage", (msgData) => handleMessage(io, socket, msgData));

    
    // Handle socket disconnection
    socket.on("disconnect", () => {
      onlineUser.delete(user._id.toString());
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

export const handleMessage = async (io, socket, msgData) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { conversationId, text, mediaUrl } = msgData;
    const senderId = socket.handshake.user._id;
    // Create a new message document
    const newMessage = await messageModel.create([
      {
        sender: senderId,
        text,
        mediaUrl,
        chat: conversationId,
        createdAt: Date.now(),
      }],
      { session }
    );
    const updateConversionLastMessage =
      await conversationModel.findByIdAndUpdate(
        conversationId,
        { $set: { lastMessage: text, updatedAt: Date.now() } },
        { session }
      );
      // Emit the message to all members of the conversation
      io.to(conversationId).emit("message", newMessage);
      await session.commitTransaction();
  } catch (error) {
    console.error("Error handling message:", error);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

export const handleSeenMessage = async (conversationId, userId) => {
  try {
    // Update the seen status
    await seenModel.findOneAndUpdate(
      { chat: conversationId, userId: userId },
      { seen: Date.now() },
      { upsert: true }
    );

    // Notify other users in the room
    io.to(conversationId).emit("messageSeen", {
      userId,
      conversationId,
      seenAt: Date.now(),
    });
  } catch (error) {
    console.error("Error updating seen status:", error);
  }
};
