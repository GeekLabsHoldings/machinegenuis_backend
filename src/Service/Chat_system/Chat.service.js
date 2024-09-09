import { Types } from "mongoose";
import conversationModel from "../../Model/Chat/conversation.model";
import messageModel from "../../Model/Chat/message.model";
import seenModel from "../../Model/Chat/seen.model";
import { create } from "domain";
import offlineMembersModel from "../../Model/Chat/offline_messages.model";

export const retrieveConversationsForMember = async (employee_Id) => {
  const conversations = await conversationModel.find({
    members: { $in: [employee_Id] },
  });
  return conversations;
};

export const createMessageInConversation = async (
  session,
  senderId,
  text,
  mediaUrl,
  conversationId,
  moment_time
) => {
  const newMessage = await messageModel.create(
    [
      {
        sender: senderId,
        text,
        mediaUrl,
        chat: conversationId,
        createdAt: moment_time,
      },
    ],
    { session }
  );
  return newMessage;
};

export const setLastMessageForConversation = async (
  session,
  conversationId,
  text,
  moment_time
) => {
  const updateConversionLastMessage = await conversationModel.findByIdAndUpdate(
    conversationId,
    { $set: { lastMessage: text, updatedAt: moment_time } },
    { session }
  );
};
export const updateSeenStatus = async (conversationId, userId, moment_time) => {
  await seenModel.findOneAndUpdate(
    { chat: conversationId, userId },
    { seen: moment_time },
    { upsert: true }
  );
};
export const findExistingOneToOneConversation = async (members) => {
  const exist = await conversationModel.findOne({
    type: "oneToOne",
    members: { $all: members },
  });
  return exist;
};
export const createConversationWithMembers = async (
  groupName,
  type,
  members,
  userId,
  createdAt
) => {
  const conversation = await conversationModel.create({
    groupName,
    type,
    members,
    admin: userId,
    createdAt,
  });
  return conversation;
};
export const getAllConversationsForUser = async (user_id) => {
  const allConversations = await conversationModel
    .find({
      members: { $all: [user_id] },
    })
    .populate("members", "firstName lastName email");
  return allConversations;
};
export const findSeenStatusesByUserId = async (user_id) => {
  const usersSeen = await seenModel.find({ userId: user_id });
  return usersSeen;
};
export const createSeenEntryForConversation = async (
  conversationId,
  user_id,
  createdAt
) => {
  const seen = await seenModel.create({
    chat: conversationId,
    userId: user_id,
    seen: createdAt,
  });
  return seen;
};
export const fetchMessagesByAggregation = async (conversationId, user_id) => {
  const pipeline = [
    // Match messages belonging to a specific conversation
    {
      $match: { chat: new Types.ObjectId(conversationId) },
    },
    {
      $lookup: {
        from: "conversations",
        localField: "chat",
        foreignField: "_id",
        as: "conversationDetails",
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "sender",
        foreignField: "_id",
        as: "senderDetails",
      },
    },
    {
      $unwind: "$conversationDetails",
    },
    {
      $unwind: "$senderDetails",
    },
    {
      $match: {
        "conversationDetails.members": {
          $in: [user_id],
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        sender: {
          _id: "$senderDetails._id",
          firstName: "$senderDetails.firstName",
          lastName: "$senderDetails.lastName",
        },
        text: 1,
        mediaUrl: 1,
        createdAt: 1,
        _id: 1,
      },
    },
  ];
  const messages = await messageModel.aggregate(pipeline);
  return messages;
};
export const addNewMembersToGroup = async (groupId, admin, newMembers) => {
  const updatedGroup = await conversationModel.findOneAndUpdate(
    { _id: groupId, admin },
    {
      $addToSet: { members: { $each: newMembers } },
    },
    { new: true }
  );
  return updatedGroup;
};
export const removeMembersFromGroup = async (
  groupId,
  admin,
  membersToRemove
) => {
  const updatedGroup = await conversationModel.findOneAndUpdate(
    { _id: groupId, admin },
    {
      $pull: { members: { $in: membersToRemove } },
    },
    { new: true }
  );
  return updatedGroup;
};
export const updateGroupName = async (groupId, groupName) => {
  const conversation = await conversationModel.findByIdAndUpdate(
    groupId,
    {
      groupName,
    },
    { new: true }
  );
  return conversation;
};
export const updateGroupAdmin = async (groupId, newAdmin) => {
  const conversation = await conversationModel.findByIdAndUpdate(
    groupId,
    {
      admin: newAdmin,
    },
    { new: true }
  );
  return conversation;
};

export const checkSenderAvailability = async (
  conversationId,
  senderId,
  session
) => {
  const result = await conversationModel
    .findOne({
      _id: conversationId,
      members: { $in: [senderId] },
    })
    .session(session);
  return result;
};
export const getConversationsByUserId = async (conversationId) => {
  const userConversations = await conversationModel
    .findById(conversationId)
    .populate("members", "name email");
  return userConversations;
};
export const getOfflineMembers = async ({ userId }) => {
  const offlineMembers = await offlineMembersModel.find({
    userId,
  });
  return offlineMembers;
};
export const createOfflineMembers = async (messageOfflineMembers, session) => {
  const offlineMembers = await offlineMembersModel.create(
    messageOfflineMembers,
    { session }
  );
  return offlineMembers;
};
export const deleteOfflineMembers = async ({ _id }) => {
  await offlineMembersModel.findByIdAndDelete(_id);
};
