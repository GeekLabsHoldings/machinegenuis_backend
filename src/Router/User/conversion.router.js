import { Router } from "express";
import * as conversionController from "../../Controller/chat/Conversion.controller";
const conversationRouter = Router();
conversationRouter.post("/create", conversionController.createConversation);
conversationRouter.get("/all", conversionController.getAllConversationsByUser);
conversationRouter.get(
  "/all-messages/:conversationId",
  conversionController.getAllMessagesWithConversations
);
conversationRouter.put("/update/add-members/:groupId",conversionController.addMembersConversations);
conversationRouter.put("/delete-members/:groupId",conversionController.removeMembersConversations);
conversationRouter.put("/update/group-name/:groupId",conversionController.updateGroupName);
conversationRouter.put("/update/group-admin/:groupId",conversionController.setNewAdmin);
export default conversationRouter;
