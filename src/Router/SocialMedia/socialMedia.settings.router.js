import { Router, } from "express";
import * as brandController from "../../Controller/SocialMedia/socialMedia.settings.controller"



const SocialSittingsRouter = Router();

// settings
SocialSittingsRouter.post("/:id/add-group", brandController.addGroup);
SocialSittingsRouter.get("/get-groups", brandController.getGroups);
SocialSittingsRouter.get("/:id/get-groups-brand", brandController.getGroupsByBrand);
SocialSittingsRouter.post("/:g_id/delete", brandController.deletGroup);


// post db
SocialSittingsRouter.get("/get-posts", brandController.getAllPosts);
SocialSittingsRouter.post("/add-posts", brandController.addPost);
SocialSittingsRouter.get("/:id/get-posts-brand", brandController.getPostByBrand);
SocialSittingsRouter.post("/:id/delete-post", brandController.deletpost);



// campaigns
SocialSittingsRouter.get("/get-campaigns", brandController.getAllCampaigns);
SocialSittingsRouter.post("/add-campaigns", brandController.addCampaigns);
SocialSittingsRouter.get("/:id/get-campaigns-brand", brandController.getCampaignByBrand);
SocialSittingsRouter.post("/:id/delete-campaigns", brandController.deletCampaigns);
SocialSittingsRouter.post("/:id/update-campaigns", brandController.updateCampaigns);


//
SocialSittingsRouter.get("/get-subscripers", brandController.get_subscripers);








export default SocialSittingsRouter