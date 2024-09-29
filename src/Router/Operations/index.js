import { Router } from "express";
import BrandCreationRouter from "./BrandCreation.router";





const OperationRouter = Router();
socialMediaRouter.use("/brand", BrandCreationRouter);


export default OperationRouter;