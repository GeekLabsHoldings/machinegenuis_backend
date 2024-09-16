import { Router } from "express";
const linkedinRouter = Router();
import * as linkedinController from "../../Controller/SocialMedia/socialMedia.linkedin.controller";
linkedinRouter.post("/add-post",linkedinController. addPostSocialMediaLinkedin);
linkedinRouter.get("/get", linkedinController.getDataLinkedin);

export default linkedinRouter;