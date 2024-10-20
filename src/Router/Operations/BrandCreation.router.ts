import { Router, } from "express";
import * as brandController from "../../Controller/Operations/BrandCreation.controller"



const BrandCreationRouter = Router();

// Domains
BrandCreationRouter.post("/check-domain-availability", brandController.checkDomains);
BrandCreationRouter.post("/register-domain", brandController.registerDomain);
BrandCreationRouter.post("/check-domain-email-verification", brandController.verificationDomain);
BrandCreationRouter.post("/activate-domain", brandController.activateDomain);
BrandCreationRouter.get("/get-all-domains", brandController.getAllDomains);
BrandCreationRouter.get("/get-domains-brand", brandController.getDomainsByBrand);




// get add Brand routes
BrandCreationRouter.post("/add-brand-all-data", brandController.addBrandWithAllData);
BrandCreationRouter.post("/add-brand", brandController.addBrand);
BrandCreationRouter.get("/get-brands", brandController.getAllBrands);
BrandCreationRouter.get("/get-all-brands", brandController.getBrands);
BrandCreationRouter.get("/get-singular-brands", brandController.getSingularBrands);
BrandCreationRouter.get("/get-brands-platform", brandController.getBrandsByPlatform);   
BrandCreationRouter.get("/get-all-brands-platform", brandController.getAllBrandsByPlatform); 




// edit brands 
BrandCreationRouter.get("/:id", brandController.getBrand);
BrandCreationRouter.post("/:id/edit-brand", brandController.editBrand);
BrandCreationRouter.post("/:id/delete-brand", brandController.deleteBrand);




// Account routes 
BrandCreationRouter.get("/:id/get-accounts", brandController.getAccounts);
BrandCreationRouter.get("/:id/get-account", brandController.getAccount);
BrandCreationRouter.post("/:id/add-change-account", brandController.addOrChangeAcount);
BrandCreationRouter.post("/:id/delete-account", brandController.deleteAccount);




// Sub-brand routes
BrandCreationRouter.post("/:parentId/add-sub-brand", brandController.addSubBrand);
BrandCreationRouter.get("/:parentId/get-sub-brands", brandController.getAllSubBrands);
BrandCreationRouter.get("/:parentId/:id", brandController.getSubBrand);
BrandCreationRouter.post("/:parentId/:id/edit-brand", brandController.editSubBrand);
BrandCreationRouter.post("/:parentId/:id/delete-brand", brandController.deleteSubBrand);






export default BrandCreationRouter;