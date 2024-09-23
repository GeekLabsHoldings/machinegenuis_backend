import { Router } from "express";
import { get_channels, add_channel, campaign, campaignByBrand, deleteMessage, get_channels_brand, get_subscripers } from "../../Controller/SocialMedia/socialMedia.telegram.controller";
import { AddTwitterChannel,getChannels } from "../../Service/SocialMedia/telegram.service";
import multer from "multer";

const TelegramRouter = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Destination folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now()+"__"+file.originalname); // Use the original name
    }
  });
  
  const upload = multer({ storage });
  


TelegramRouter.post("/add-telegram-channel",add_channel);


TelegramRouter.get("/list-telegram-channels", get_channels);
TelegramRouter.get("/list-telegram-channels-brand", get_channels_brand);

TelegramRouter.post("/campaign-broadcast", upload.single('file'),campaign)

TelegramRouter.post("/campaign-brand", upload.single('file'),campaignByBrand)

TelegramRouter.post("/delete-message", deleteMessage)

TelegramRouter.get("/subscripers", get_subscripers);

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

export default TelegramRouter;