import { Router } from "express";
import twitterRouter from "./socialMedia.twitter.router";
import linkedinRouter from "./socialMedia.linkedin.router";
import NewsLetterRouter from "./NewsLetterRouter";

const socialMediaRouter = Router();

socialMediaRouter.use("/twitter", twitterRouter);
socialMediaRouter.use("/linkedin", linkedinRouter);
socialMediaRouter.use("/news-letter", NewsLetterRouter);

export default socialMediaRouter;
