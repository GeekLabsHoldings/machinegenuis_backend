import { Router } from "express";
import * as brandController from "../../Controller/Operations/BrandCreation.controller"



const BrandCreationRouter = Router();

// Domains
BrandCreationRouter.get("/check-domain-availability", brandController.checkDomains);

// Brand routes
BrandCreationRouter.post("/add-brand", brandController.addBrand);
BrandCreationRouter.get("/get-brands", brandController.getAllBrands);
BrandCreationRouter.get("/:id", brandController.getBrand);
BrandCreationRouter.post("/:id/edit-brand", brandController.editBrand);
BrandCreationRouter.post("/:id/delete-brand", brandController.deleteBrand);

// Account routes 
BrandCreationRouter.get("/:id/get-account", brandController.getAccount);
BrandCreationRouter.post("/:id/add-change-account", brandController.addOrChangeAcount);

// Sub-brand routes
BrandCreationRouter.post("/:parentId/add-sub-brand", brandController.addSubBrand);
BrandCreationRouter.get("/:parentId/get-sub-brands", brandController.getAllSubBrands);
BrandCreationRouter.get("/:parentId/:id", brandController.getSubBrand);
BrandCreationRouter.post("/:parentId/:id/edit-brand", brandController.editSubBrand);
BrandCreationRouter.post("/:parentId/:id/delete-brand", brandController.deleteSubBrand);






export default BrandCreationRouter;