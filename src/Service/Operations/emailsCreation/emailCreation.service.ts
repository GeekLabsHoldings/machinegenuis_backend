import ZohoEmailsModel from "../../../Model/Zoho/Emails/ZohoEmails";
import { ICreateUserBody } from "../../Zoho/UserAndOrganization/IUserZohoService";






export async function addEmail(userData:ICreateUserBody) {
    try {
        const MainAccount = await ZohoEmailsModel.find({isAdminAccount:true})

    } catch (error) {
        console.log(error)
    }
}


export async function updateAccessToken(client_id:string, client_secret:string, code:string) {
    try {
        
    } catch (error) {
        console.log(error)
    }
}


