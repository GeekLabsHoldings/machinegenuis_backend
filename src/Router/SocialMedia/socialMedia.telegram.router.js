import { Router } from "express";
import { get_channels, add_channel, campaign } from "../../Controller/SocialMedia/socialMedia.telegram.controller";
import { AddTwitterChannel,getChannels } from "../../Service/SocialMedia/telegram.service";
const telegramRouter = Router();




telegramRouter.post("/add-telegram-channel",add_channel);


telegramRouter.get("/list-telegram-channels", get_channels);

telegramRouter.get("/campaign",campaign)


// telegramRouter.post("/tmp",
//     async (req , res)=>{
//         const newGroup = await AddTwitterChannel("test1",
//             "https://t.me/+uJf-AAFC0eA1Yzc0",
//             -1002440854240,
//             2,
//             "niche",
//             "PST",
//             "TELEGRAM",
//             30
//         );
//         res.json(newGroup)

//         const sendMessageToAll = (message) => {
//             chatIds.forEach((chatId) => {
//               bot.sendMessage(chatId, message)
//                 .then(() => {
//                   console.log(`Message sent to chat ID: ${chatId}`);
//                 })
//                 .catch((err) => {
//                   console.error(`~~~~~~Failed to send message to chat ID: ${chatId}`, err);
//                 });
//             });
//           };
//     }
// );

export default telegramRouter;