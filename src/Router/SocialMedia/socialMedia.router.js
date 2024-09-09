import { Router } from "express";
import * as socialMediaController from "../../Controller/SocialMedia/socialMedia.controller";

const socialMediaRouter = Router();
socialMediaRouter.post("/add-post", socialMediaController.addPostSocialMedia);
socialMediaRouter.post("/Enc-Data", socialMediaController.encryptSensitiveData);

export default socialMediaRouter;
