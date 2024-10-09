import { Router } from "express";
import * as facebookController from "../../Controller/SocialMedia/socialMedia.facebook.controller";
const facebookRouter = Router();
facebookRouter.get("/get-url/", facebookController.getPreSignedURL);
facebookRouter.get("/get-subs/", facebookController.BrandSubs);
facebookRouter.post(
  "/add-post/text/:brandId",
  facebookController.addPostSocialMediaFacebookText
);
facebookRouter.post(
    "/add-post/photos/:brandId",
    facebookController.addPostSocialMediaFacebookPhoto
  );

export default facebookRouter;
