import BankAccountModel from "../../../Model/Accounting/BankAccount/BankAccountModel";
import IBankAccountModel from "../../../Model/Accounting/BankAccount/IBankAccountModel";
import IBankAccountService from "./IBankAccountService";

class BankAccountService implements IBankAccountService {
    async createNewBankAccount(bankAccount: IBankAccountModel): Promise<IBankAccountModel> {
        const newBankAccount = new BankAccountModel(bankAccount);
        return newBankAccount.save();
    }
    async getBankAccount(page: number, limit: number): Promise<IBankAccountModel[]> {
        return BankAccountModel.find().skip(page * limit).limit(limit);
    }

}

export default BankAccountService;