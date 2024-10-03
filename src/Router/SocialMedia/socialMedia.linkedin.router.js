import { Router } from "express";
const linkedinRouter = Router();
import * as linkedinController from "../../Controller/SocialMedia/socialMedia.linkedin.controller";
linkedinRouter.post("/add-post/:brandId",linkedinController. addPostSocialMediaLinkedin);
linkedinRouter.get("/get/:brand", linkedinController.getDataLinkedin);

export default linkedinRouter;