import { ClientSession } from "mongoose";
import linkedinAccountsService from "../../../Service/HR/LinkedinAccounts/LinkedinAccountService";
import SuccessMessage from "../../../Utils/SuccessMessages";
import ILinkedinAccountController, { ILinkedinUserAccount } from "./ILinkedinAccountsController";
import systemError from "../../../Utils/Error/SystemError";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";

class LinkedinAccountController implements ILinkedinAccountController {

    async createAccount(accountInfo: ILinkedinUserAccount): Promise<string> {
        const accountInfoToken = linkedinAccountsService.createToken(accountInfo);
        const create = await linkedinAccountsService.createLinkedinAccount(accountInfoToken);
        return SuccessMessage.DONE;
    }

    async changeAccountIsBusy(accountId: string, isBusy: boolean, session: ClientSession): Promise<boolean> {
        const result = await linkedinAccountsService.changeAccountIsBusy(accountId, isBusy, session)
        return result ? true : false;
    }
    async getOneFreeAccounts(session: ClientSession): Promise<ILinkedinUserAccount & { _id: string }> {
        const account = await linkedinAccountsService.getFreeBusyLinkedinAccounts(false, session);
        if (!account)
            return systemError.setStatus(404).setMessage(ErrorMessages.LINKEDIN_ACCOUNT_NOT_FOUND).throw();
        const user = linkedinAccountsService.verifyToken(account[0].accountInfo);
        const result = {
            _id: account[0]._id as string,
            userName: user.userName,
            password: user.password
        }
        return result;
    }

}

const linkedinAccountController = new LinkedinAccountController();
export default linkedinAccountController;