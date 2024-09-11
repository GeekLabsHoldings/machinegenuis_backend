import { Router } from "express";
const linkedinRouter = Router();
import { addPostSocialMediaLinkedin } from "../../Controller/SocialMedia/socialMedia.linkedin.controller";
linkedinRouter.post("/add-post", addPostSocialMediaLinkedin);
export default linkedinRouter;