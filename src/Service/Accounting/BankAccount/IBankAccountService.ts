import IBankAccountModel from "../../../Model/Accounting/BankAccount/IBankAccountModel";

export default interface IBankAccountService {
    createNewBankAccount(bankAccount:IBankAccountModel): Promise<IBankAccountModel>;
    getBankAccount(page: number, limit: number): Promise<IBankAccountModel[]>;
}