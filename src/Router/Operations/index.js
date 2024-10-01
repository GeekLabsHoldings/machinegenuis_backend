import { Router } from "express";
import BrandCreationRouter from "./BrandCreation.router";





const OperationRouter = Router();
OperationRouter.use("/brand", BrandCreationRouter);


export default OperationRouter;