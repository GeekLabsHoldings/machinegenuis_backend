import conversationModel from "../../Model/Chat/conversation.model";
import messageModel from "../../Model/Chat/message.model";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { handleSeenMessage, onlineUser } from "./chat.controller";
import { Types } from "mongoose";
import moment from "../../Utils/DateAndTime";
import * as conversation_chat from "../../Service/Chat_system/Chat.service";
import systemError from "../../Utils/Error/SystemError";
const addMemberJoin = (conversation_id, members) => {
  for (const item of members) {
    const socket = onlineUser.get(item);
    if (socket) {
      console.log("HERE", socket.id);
      socket.join(conversation_id);
    }
  }
};
const removeMemberLeave = (conversation_id, members) => {
  for (const item of members) {
    const socket = onlineUser.get(item);
    if (socket) {
      console.log("LEAVING ROOM", socket.id);
      socket.leave(conversation_id);
    }
  }
};
export const createConversation = async (req, res) => {
  try {
    const { groupName, type, members } = req.body;
    const userId = req.body.currentUser._id;
    if (type == "oneToOne") {
      if (members.length !== 2) {
        return systemError
          .setStatus(406)
          .setMessage(ErrorMessages.CONVERSATION_ERROR)
          .throw();
      } else {
        const exist = await conversation_chat.findExistingOneToOneConversation(
          members
        );
        if (exist) return res.json({ message: "Exist" });
      }
    }
    const createdAt = moment().valueOf();
    const conversation = await conversation_chat.createConversationWithMembers(
      groupName,
      type,
      members,
      userId,
      createdAt
    );
    console.log({ onlineUser });
    addMemberJoin(conversation._id.toString(), members);
    return res.json({
      Success: "true",
      Message: "done created conversion",
      result: conversation,
    });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const getAllConversationsByUser = async (req, res) => {
  try {
    const user_id = req.body.currentUser._id;
    const allConversations = await conversation_chat.getAllConversationsForUser(
      user_id
    );
    const usersSeen = await conversation_chat.findSeenStatusesByUserId(user_id);
    console.log(usersSeen);
    const seenMap = new Map();
    usersSeen.forEach((item) => {
      seenMap.set(item.chat.toString(), item.seen);
    });
    const result = await Promise.all(
      allConversations.map(async (conversation) => {
        const lastSeen = seenMap.get(conversation._id.toString()) || 0;
        return {
          _id: conversation._id,
          type: conversation.type,
          groupName: conversation.groupName,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          members: conversation.members,
          admin: conversation.admin,
          lastMessage: conversation.lastMessage,
          lastSeen, // Adding last seen information
        };
      })
    );
    return res.json({ success: true, result });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};

export const getAllMessagesWithConversations = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const user_id = req.body.currentUser._id;
    const createdAt = moment().valueOf();
    // const seen = await conversation_chat.createSeenEntryForConversation(
    //   conversationId,
    //   user_id,
    //   createdAt
    // );
    await handleSeenMessage(conversationId, user_id);

    const messages = await conversation_chat.fetchMessagesByAggregation(
      conversationId,
      user_id
    );
    return res.json({ success: true, messages });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const addMembersConversations = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    let { newMembers } = req.body;
    const admin = req.body.currentUser._id;
    console.log({ admin });

    if (!groupId) {
      return res.status(400).json({
        message: "Admin ID, group ID, and new members must be provided",
        error: true,
      });
    }
    newMembers = [...new Set(newMembers)];
    const updatedGroup = await conversation_chat.addNewMembersToGroup(
      groupId,
      admin,
      newMembers
    );
    if (!updatedGroup)
      return res
        .status(404)
        .json({ success: false, Message: "the group has not been updated!" });
    addMemberJoin(groupId, newMembers);
    return res.status(201).json({
      success: true,
      result: updatedGroup,
      Message: "the group updated!",
    });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const removeMembersConversations = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { membersToRemove } = req.body;
    const admin = req.body.currentUser._id;
    console.log({ admin });

    if (!groupId || !membersToRemove || !Array.isArray(membersToRemove)) {
      return res.status(400).json({
        message:
          "Group ID and a valid array of members to remove must be provided",
        error: true,
      });
    }
    const adminExist = membersToRemove.includes(admin);
    if (adminExist)
      return systemError
        .setStatus(406)
        .setMessage(ErrorMessages.ADMIN_CANNOT_REMOVE_HIMSELF)
        .throw();
    // Remove members from the group
    const updatedGroup = await conversation_chat.removeMembersFromGroup(
      groupId,
      admin,
      membersToRemove
    );
    if (!updatedGroup) {
      return res
        .status(404)
        .json({ success: false, message: "The group has not been updated!" });
    }

    // Handle socket leave
    removeMemberLeave(groupId, membersToRemove);

    return res.status(201).json({
      success: true,
      result: updatedGroup,
      message: "The group has been updated!",
    });
  } catch (error) {
    console.error("Error in removeMembersConversations:", error);
    return systemError.sendError(res, error);
  }
};
export const updateGroupName = async (req, res, next) => {
  const { groupId } = req.params;
  const { groupName } = req.body;
  if (!groupId)
    return res.json({ success: false, message: "In -valid groupId" });
  const conversation = await conversation_chat.updateGroupName(
    groupId,
    groupName
  );

  if (!conversation) return res.json({ success: false, message: "Error" });
  return res.json({ success: true, message: "Done", result: conversation });
};
export const setNewAdmin = async (req, res, next) => {
  const { groupId } = req.params;
  const { newAdmin } = req.body;
  if (!groupId)
    return res.json({ success: false, message: "In -valid groupId" });
  const conversation = await conversation_chat.updateGroupAdmin(
    groupId,
    newAdmin
  );

  if (!conversation) return res.json({ success: false, message: "Error" });
  return res.json({ success: true, message: "Done", result: conversation });
};
