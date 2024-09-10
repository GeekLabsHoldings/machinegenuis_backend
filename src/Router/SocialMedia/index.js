import { Router } from "express";
import twitterRouter from "./socialMedia.router";
const socialMediaRouter = Router();

socialMediaRouter.use('/twitter',twitterRouter)

export default socialMediaRouter;
