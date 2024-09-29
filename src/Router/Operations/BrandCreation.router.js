import { Router } from "express";
import * as brandController from "../../Controller/Operations/BrandCreation.controller"



const BrandCreationRouter = Router();

BrandCreationRouter.post("/add-brand",brandController.addBrand )
BrandCreationRouter.get("/get-brands",brandController.getBrands )


BrandCreationRouter.get("/:id/",brandController.getBrand )
BrandCreationRouter.post("/:id/edit-brand", brandController.editBrand)
BrandCreationRouter.post("/:id/delete-brand/", brandController.deleteBrand) 

BrandCreationRouter.post("/:id/get-account/", brandController.getAccount) 
BrandCreationRouter.post("/:id/add-change-account/", brandController.addOrDeleteAcount ) 

BrandCreationRouter.post("/:id/add-sub-brand", brandController.addSubBrand)
BrandCreationRouter.get("/:id/get-sub-brands", brandController.getSubBrands )

BrandCreationRouter.get("/:id/:sub_id", brandController.getBrand)
BrandCreationRouter.post("/:id/:sub_id/edit-brand/", brandController.editSubBrand)
BrandCreationRouter.post("/:id/:sub_id/delete-brand/", brandController.deleteSubBrand)
  
BrandCreationRouter.post("/:id/:sub_id/get-account/", brandController.getAccount)
BrandCreationRouter.post("/:id/:sub_id/add-change-account/", brandController.addOrDeleteAcount) 

export default BrandCreationRouter;