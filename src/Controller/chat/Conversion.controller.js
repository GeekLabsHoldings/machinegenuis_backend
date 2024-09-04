import conversationModel from "../../Model/Chat/conversation.model";
import messageModel from "../../Model/Chat/message.model";
import seenModel from "../../Model/Chat/seen.model";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { onlineUser } from "./chat.controller";
import { Types } from "mongoose";

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
    if (type == "oneToOne") {
      if (members.length !== 2) {
        return systemError
          .setStatus(406)
          .setMessage(ErrorMessages.CONVERSATION_ERROR)
          .throw();
      } else {
        const exist = await conversationModel.findOne({
          type: "oneToOne",
          members: { $all: members },
        });
        if (exist) return res.json({ message: "Exist" });
      }
    }
    const createdAt = Date.now();
    const conversation = await conversationModel.create({
      groupName,
      type,
      members,
      admin: req.body.currentUser._id,
      createdAt,
    });
    console.log({ onlineUser });
    addMemberJoin(conversation._id.toString(), members);
    return res.json({
      Success: "true",
      Message: "done created conversion",
      result: conversation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllConversationsByUser = async (req, res) => {
  try {
    const user_id = req.body.currentUser._id;
    const allConversations = await conversationModel.find({
      members: { $all: [user_id] },
    });
    const usersSeen = await seenModel.find({ userId: user_id });
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
          lastSeen, // Adding last seen information
        };
      })
    );
    return res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllMessagesWithConversations = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const user_id = req.body.currentUser._id;

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
        $unwind: "$conversationDetails",
      },
      {
        $match: {
          "conversationDetails.members": {
            $in: [user_id],
          },
        },
      },
      {
        $project: {
          sender: 1,
          text: 1,
          mediaUrl: 1,
          _id: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    const createdAt = Date.now();
    const seen = await seenModel.create({
      chat: conversationId,
      userId: user_id,
      seen: createdAt,
    });
    const messages = await messageModel.aggregate(pipeline);
    return res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const addMembersConversations = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { newMembers } = req.body;
    const admin = req.body.currentUser._id;
    console.log({ admin });

    if (!groupId) {
      return res.status(400).json({
        message: "Admin ID, group ID, and new members must be provided",
        error: true,
      });
    }

    const updatedGroup = await conversationModel.findOneAndUpdate(
      { _id: groupId, admin },
      {
        $push: { members: { $each: newMembers } },
      },
      { new: true }
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
    res.status(500).json({ error: error.message, stack: error });
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

    // Remove members from the group
    const updatedGroup = await conversationModel.findOneAndUpdate(
      { _id: groupId, admin },
      {
        $pull: { members: { $in: membersToRemove } },
      },
      { new: true }
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
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};
export const updateGroupName = async (req, res, next) => {
  const { groupId } = req.params;
  if (!groupId)
    return res.json({ success: false, message: "In -valid groupId" });
  const conversation = await conversationModel.findByIdAndUpdate(
    groupId,
    {
      groupName: req.body.groupName,
    },
    { new: true }
  );
  if (!conversation) return res.json({ success: false, message: "Error" });
  return res.json({ success: true, message: "Done", result: conversation });
};
 