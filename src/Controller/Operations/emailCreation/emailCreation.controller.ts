import { Request, Response } from "express";
import systemError from "../../../Utils/Error/SystemError";
import { ICreateUserBody } from "../../../Service/Zoho/UserAndOrganization/IUserZohoService";
import UserZohoService from "../../../Service/Zoho/UserAndOrganization/UserAndOrganization";
import ZohoEmailsModel from "../../../Model/Zoho/Emails/ZohoEmails";
import EmailsZohoModelService from "../../../Service/Emails/EmailsZohoModelService";
import IZohoEmailModel from "../../../Model/Zoho/Emails/IZohoEmails";




export async function addEmail(req: Request, res: Response) {
    try {
        const mainAccount = await new EmailsZohoModelService().getMainAccount()

        const userData: ICreateUserBody = {...req.body.userData, employeeId:Date.now(), oneTimePassword:false}
        
        const brand = req.body.brand


        if (mainAccount) {
            const zohoService = new UserZohoService(mainAccount.clientId, mainAccount.clientSecret, mainAccount.zohoId);
            await zohoService.generateAccessToken(mainAccount.refreshToken);
            const newUser = await zohoService.addNewUser(userData)

            const userEmail: IZohoEmailModel = {
                accountId: newUser.accountId,
                accountName: newUser.displayName, zohoId: String(newUser.policyId.zoid), domain: newUser.accountName,
                department: req.body.currentUser.department, brand: brand, accountEmail: newUser.mailboxAddress,
                clientId: "", clientSecret: "", refreshToken: "", accessToken: "", expiredIn: Number(req.body.expiredIn) || 999999999999999
            }
            const addedAcount = await new EmailsZohoModelService().addEmailAccount(userEmail)

            return res.json(addedAcount)
        }
        return res.status(404).json({ message: "no admin account found" })
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}



export async function updateAccessToken(req: Request, res: Response) {
    try {
        const acc_id = req.body.acc_id
        const email = req.body.email
        const code = req.body.code
        const clientId = req.body.clientId
        const clientSecret = req.body.clientSecret

        const mainAccount = await new EmailsZohoModelService().getEmailAccountByIDorEmail(acc_id, email)
        if (mainAccount) {
            const zohoService = new UserZohoService(clientId, clientSecret, mainAccount.zohoId)
            const accessTokens = await zohoService.generateAccessAndRefreshToken(code)
            const updatedAccount = await new EmailsZohoModelService().updateAccessToken(acc_id, accessTokens.access_token, accessTokens.refresh_token,
                 clientId, clientSecret,req.body.expiredIn)

            return res.json({ updatedAccount, accessTokens })
        }
        return res.status(404).json({ message: "no admin account found" })
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}


export async function addSignture(req: Request, res: Response) {
    try {
        const name = req.body.name
        const content = req.body.content
        const position = req.body.position
        const assignUsers = req.body.assignUsers
        const acc_id = req.body.acc_id
        const email = req.body.email


        const mainAccount = await new EmailsZohoModelService().getEmailAccountByIDorEmail(acc_id, email)
        if (mainAccount) {
            const zohoService = new UserZohoService(mainAccount.clientId, mainAccount.clientSecret, mainAccount.zohoId)
            const sig = zohoService.addSignture({name, content, position, assignUsers}, mainAccount.accessToken)

            return res.json({sig})
        }
        return res.status(404).json({ message: "no admin account found" })
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}



export async function getAllAccounts(req: Request, res: Response) {
    try{

        const accounts = await new EmailsZohoModelService().getEmailAccounts()
        return res.json(accounts)
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}



export async function getAccount(req: Request, res: Response) {
    try{
        const acc_id = String(req.query.acc_id)
        const email = String(req.query.email)
        const account = await new EmailsZohoModelService().getEmailAccountByIDorEmail(acc_id, email)
        return res.json(account)
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }    
}



export async function getAccountByBorD(req: Request, res: Response) {
    try{
        const department = String(req.query.department)
        const brand = String(req.query.brand)
        const account = await new EmailsZohoModelService().getEmailAccount(department, brand)
        return res.json(account)
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }    
}