import { Request, Response } from "express";
import systemError from "../../../Utils/Error/SystemError";
import { ICreateUserBody } from "../../../Service/Zoho/UserAndOrganization/IUserZohoService";
import UserZohoService from "../../../Service/Zoho/UserAndOrganization/UserAndOrganization";
import ZohoEmailsModel from "../../../Model/Zoho/Emails/ZohoEmails";
import EmailsZohoModelService from "../../../Service/Emails/EmailsZohoModelService";
import IZohoEmailModel from "../../../Model/Zoho/Emails/IZohoEmails";
import IZohoEmailCreation from "./IZohoEmailCreation.interface";




export async function addEmail(req: Request, res: Response) {
    try {
        const emailService =  new EmailsZohoModelService()
        const mainAccount = await emailService.getMainAccount()

        const userData: ICreateUserBody = {...req.body.userData, employeeId:Date.now(), oneTimePassword:false}
        
        const brand = req.body.brand
        const department = req.body.department

        if (mainAccount) {
            const zohoService = new UserZohoService(mainAccount.clientId, mainAccount.clientSecret, mainAccount.zohoId);
            if (!mainAccount.expiredIn || mainAccount.expiredIn <= new Date().valueOf()) {
                console.log("Enter Here");
                const accessToken = await zohoService.generateAccessToken(mainAccount.refreshToken);
                const expire = new Date().valueOf() + 3600000;
                await emailService.updateAccessToken(String(mainAccount._id), accessToken, expire);
            }
           
            const newUser = await zohoService.addNewUser(userData)

            const userEmail: IZohoEmailCreation = {
                accountId: newUser.accountId,
                accountName: newUser.displayName, zohoId: String(newUser.policyId.zoid), domain: newUser.accountName,
                department: department, brand: brand, accountEmail: newUser.mailboxAddress,
            }
            const addedAccount = await emailService.addEmailAccount(userEmail)

            return res.json(addedAccount)
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

        const emailService =  new EmailsZohoModelService()
        const mainAccount = await emailService.getEmailAccountByIDorEmail(acc_id, email)
        if (mainAccount) {
            const zohoService = new UserZohoService(clientId, clientSecret, mainAccount.zohoId)
            
            if (!mainAccount.expiredIn || mainAccount.expiredIn <= new Date().valueOf()) {
                console.log("Enter Here");
                const accessTokens = await zohoService.generateAccessAndRefreshToken(code)
                const expire = new Date().valueOf() + 3600000;
                const updatedEmail = await emailService.updateAccessAndRefreshToken(acc_id, accessTokens.access_token, accessTokens.refresh_token,
                    expire,clientId, clientSecret,);

                    return res.json({ updatedEmail, accessTokens })
            }

            return res.status(404).json({ message: "access Tokens did not expire" })
        }
        return res.status(404).json({ message: "no admin account found" })
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}


export async function addSignature(req: Request, res: Response) {
    try {
        const name = req.body.name
        const content = req.body.content
        const position = req.body.position
        const assignUsers = req.body.assignUsers
        const acc_id = req.body.acc_id
        const email = req.body.email


        const emailService =  new EmailsZohoModelService()
        const mainAccount = await emailService.getEmailAccountByIDorEmail(acc_id, email)
        if (mainAccount) {
            const zohoService = new UserZohoService(mainAccount.clientId, mainAccount.clientSecret, mainAccount.zohoId)
            const sig = await zohoService.addSignature({name, content, position, assignUsers})

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

        const emailService =  new EmailsZohoModelService()
        const accounts = await emailService.getEmailAccounts()
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
        const emailService =  new EmailsZohoModelService()
        const account = await emailService.getEmailAccountByIDorEmail(acc_id, email)
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

        const emailService =  new EmailsZohoModelService()
        const account = await emailService.getEmailAccount(department, brand)
        return res.json(account)
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }    
}