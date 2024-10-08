import { Router } from "express";
import * as telegramController from "../../Controller/SocialMedia/socialMedia.telegram.controller";



const TelegramRouter = Router();



TelegramRouter.post("/add-telegram-channel",telegramController.add_channel);
TelegramRouter.get("/list-telegram-channels",telegramController.get_channels);
TelegramRouter.get("/list-telegram-channels-brand/:id",telegramController.get_channels_brand);
TelegramRouter.post("/campaign-broadcast",telegramController.campaign);
TelegramRouter.post("/campaign-brand/:id",telegramController.campaignByBrand);
TelegramRouter.post("/delete-message",telegramController.deleteMessage);
TelegramRouter.get("/subscripers/:id",telegramController.get_subscripers);
export default TelegramRouter;
