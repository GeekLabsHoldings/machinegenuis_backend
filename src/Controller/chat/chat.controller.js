import mongoose from "mongoose";
import moment from "../../Utils/DateAndTime";
import * as conversation_chat from "../../Service/Chat_system/Chat.service.js";
import { io } from "../../socketIo.js";
// Define the msgHandler function
export const onlineUser = new Map();
export const msgHandler = async (io, socket) => {
  // create a room
  try {
    const user = socket.handshake.user;
    onlineUser.set(user?._id?.toString(), socket);
    const conversations =
      await conversation_chat.retrieveConversationsForMember(user._id);
    for (const conversation of conversations) {
      socket.join(conversation._id.toString());
    }
    // Listen for messages from the client
    socket.on("sendMessage", (msgData) => handleMessage(io, socket, msgData));

    // Handle socket disconnection
    socket.on("disconnect", () => {
      onlineUser.delete(user._id.toString());
    });
  } catch (error) {
    console.log(error);
  }
};

export const handleMessage = async (io, socket, msgData) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const senderId = socket.handshake.user._id;
  try {
    const { conversationId, text, mediaUrl } = msgData;
    // Create a new message document
    const checkSenderAvailability =
      await conversation_chat.checkSenderAvailability(
        conversationId,
        senderId,
        session
      );
    if (!checkSenderAvailability) throw new Error("Sender not available");
    const moment_time = moment().valueOf();

    const newMessage = await conversation_chat.createMessageInConversation(
      session,
      senderId,
      text,
      mediaUrl,
      conversationId,
      moment_time
    );

    await conversation_chat.setLastMessageForConversation(
      session,
      conversationId,
      text,
      moment_time
    );

    // Emit the message to all members of the conversation
    io.to(conversationId).emit("message", newMessage);
    await session.commitTransaction();
  } catch (error) {
    io.to(onlineUser.get(senderId.toString()).id).emit(
      "message",
      " Error sending message"
    );
    console.error("Error handling message:", error);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

export const handleSeenMessage = async (conversationId, userId) => {
  try {
    // Update the seen status
    const moment_time = moment().valueOf();
    await conversation_chat.updateSeenStatus(
      conversationId,
      userId,
      moment_time
    );
    // Notify other users in the room
    io.to(conversationId).emit("messageSeen", {
      userId,
      conversationId,
      seenAt: moment_time,
    });
  } catch (error) {
    console.error("Error updating seen status:", error);
  }
};
