import { Router } from "express";
import * as facebookController from "../../Controller/SocialMedia/socialMedia.facebook.controller";
const facebookRouter = Router();
facebookRouter.get("/get-url/", facebookController.getPreSignedURL);
facebookRouter.post(
  "/add-post/text",
  facebookController.addPostSocialMediaFacebookText
);
facebookRouter.post(
    "/add-post/photos",
    facebookController.addPostSocialMediaFacebookPhoto
  );

export default facebookRouter;
