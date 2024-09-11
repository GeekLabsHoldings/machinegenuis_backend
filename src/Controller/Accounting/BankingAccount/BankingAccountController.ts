import IBankAccountModel from "../../../Model/Accounting/BankAccount/IBankAccountModel";
import BankAccountService from "../../../Service/Accounting/BankAccount/BankAccountService";
import IBankAccountController from "./IBankingAccountController";

export default class BankAccountController implements IBankAccountController {
    async createBankAccount(bankAccountData: IBankAccountModel): Promise<IBankAccountModel> {
        const bankAccountService = new BankAccountService();
        return await bankAccountService.createNewBankAccount(bankAccountData);
    }

    async getBankAccount(page: number, limit: number): Promise<IBankAccountModel[]> {
        const bankAccountService = new BankAccountService();
        return await bankAccountService.getBankAccount(page, limit);
    }
}