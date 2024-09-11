import { Router } from "express";
import twitterRouter from "./socialMedia.twitter.router";
import linkedinRouter from "./socialMedia.linkedin.router";
const socialMediaRouter = Router();
socialMediaRouter.use("/twitter", twitterRouter);
socialMediaRouter.use("/linkedin", linkedinRouter);

export default socialMediaRouter;
