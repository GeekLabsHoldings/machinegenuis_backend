import { Router } from "express";
import twitterRouter from "./socialMedia.twitter.router";
import linkedinRouter from "./socialMedia.linkedin.router";
import redditRouter from "./socialMedia.reddit.router";
import facebookRouter from "./socialMedia.facebook.router";
import NewsLetterRouter from "./NewsLetterRouter";
import TelegramRouter from "./socialMedia.telegram.router";
import { generateHashtags } from "../../Controller/SocialMedia/socialMedia.twitter.controller";


const socialMediaRouter = Router();

socialMediaRouter.use("/twitter", twitterRouter);
socialMediaRouter.use("/linkedin", linkedinRouter);
socialMediaRouter.use("/reddit", redditRouter);
socialMediaRouter.use("/facebook", facebookRouter);
socialMediaRouter.use("/news-letter", NewsLetterRouter);
socialMediaRouter.use("/telegram", TelegramRouter);
socialMediaRouter.post(
    "/generate-hashtags",
    generateHashtags
  );


export default socialMediaRouter;
