import { Router, } from "express";
import * as brandController from "../../Controller/Operations/BrandCreation.controller"


const BrandsRouter = Router();

// Domains
BrandsRouter.post("/check-domain-availability", brandController.checkDomains);


// get add Brand routes
BrandsRouter.get("/get-brands", brandController.getAllBrands);
BrandsRouter.get("/get-all-brands", brandController.getBrands);
BrandsRouter.get("/get-singular-brands", brandController.getSingularBrands);
BrandsRouter.get("/get-brands-platform", brandController.getBrandsByPlatform);   
BrandsRouter.get("/get-all-brands-platform", brandController.getAllBrandsByPlatform); 


// Account routes 
BrandsRouter.get("/:id/get-accounts", brandController.getAccounts);
BrandsRouter.get("/:id/get-account", brandController.getAccount);


// Sub-brand routes
BrandsRouter.get("/:parentId/get-sub-brands", brandController.getAllSubBrands);
BrandsRouter.get("/:parentId/:id", brandController.getSubBrand);






export default BrandsRouter;