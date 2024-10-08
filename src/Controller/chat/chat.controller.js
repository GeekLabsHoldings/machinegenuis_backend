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
    if (onlineUser.has(user._id.toString())) {
      onlineUser.get(user._id.toString()).disconnect();
    }
    onlineUser.set(user?._id?.toString(), socket);
    const conversations =
      await conversation_chat.retrieveConversationsForMember(user._id);
    for (const conversation of conversations) {
      socket.join(conversation._id.toString());
    }
    const offlineMembers = await conversation_chat.getOfflineMembers({
      userId: user._id,
    });

    for (const offlineMember of offlineMembers) {
      socket.emit("message", offlineMember.message);
    }
    await conversation_chat.deleteOfflineMembers(user._id);
    // Listen for messages from the client
    socket.on("sendMessage", (msgData) => handleMessage(io, socket, msgData));
    socket.on("userTyping", (msgData) => handleUserTyping(io, socket, msgData));

    socket.on("userSeenMessage", async (msgData) => {
      const moment_time = moment().valueOf();
      const { conversationId } = msgData;
      await conversation_chat.updateSeenStatus(
        conversationId,
        user._id,
        moment_time
      );
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      onlineUser.delete(user._id.toString());
      console.log(`Client disconnected: ${socket.id}`);
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
    const { conversationId, text, media } = msgData;
    if (!text && !media) throw new Error("Message must have text or media");
    // Create a new message document
    const checkSenderAvailability =
      await conversation_chat.checkSenderAvailability(
        conversationId,
        senderId,
        session
      );
    if (!checkSenderAvailability) throw new Error("Sender not available");
    const moment_time = moment().valueOf();
    // Emit the message to all members of the conversation
    socket.to(conversationId).emit("message", {
      sender: {
        _id: senderId,
        firstName: socket.handshake.user.firstName,
        lastName: socket.handshake.user.lastName,
        theme: socket.handshake.user.theme,
      },
      text,
      media,
      chat: conversationId,
      createdAt: moment_time,
    });
    const newMessage = await conversation_chat.createMessageInConversation(
      session,
      senderId,
      text,
      media,
      conversationId,
      moment_time
    );
    await conversation_chat.setLastMessageForConversation(
      session,
      conversationId,
      text,
      moment_time
    );
    const userConversations = await conversation_chat.getConversationsByUserId(
      conversationId
    );
    const offlineMembers = userConversations.members.filter((member) => {
      return !onlineUser.has(member._id.toString());
    });
    const messageOfflineMembers = offlineMembers.map((member) => {
      return {
        userId: member._id,
        message: newMessage,
      };
    });
    await conversation_chat.createOfflineMembers(
      messageOfflineMembers,
      session
    );

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

export const handleUserTyping = async (io, socket, msgData) => {
  try {
    const { conversationId } = msgData;
    const { _id, firstName, lastName, theme } = socket.handshake.user;
    socket.to(conversationId).emit("userTyping", {
      user: { _id, firstName, lastName, theme },
      conversationId,
    });
  } catch (error) {
    console.error("Error handling user typing:", error);
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
    socket.to(conversationId).emit("messageSeen", {
      userId,
      conversationId,
      seenAt: moment_time,
    });
  } catch (error) {
    console.error("Error updating seen status:", error);
  }
};
