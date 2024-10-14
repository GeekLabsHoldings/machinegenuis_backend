import { Router, } from "express";
import * as emailController from "../../../Controller/Operations/emailCreation/emailCreation.controller"



const emailCreationRouter = Router();


emailCreationRouter.post("/add-email", emailController.addEmail);
emailCreationRouter.post("/update-accesstokens", emailController.updateAccessToken);
emailCreationRouter.get("/get-all-accounts", emailController.getAllAccounts);
emailCreationRouter.get("/get-account", emailController.getAccount);
emailCreationRouter.get("/get-accounts-brand-department", emailController.getAccountByBorD);


export default emailCreationRouter;