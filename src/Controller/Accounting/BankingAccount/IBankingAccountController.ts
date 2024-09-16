import IBankAccountModel from "../../../Model/Accounting/BankAccount/IBankAccountModel";

export default interface IBankAccountController {
    getBankAccount(page: number, limit: number): Promise<IBankAccountModel[]>;
    createBankAccount(bankAccountData: IBankAccountModel): Promise<IBankAccountModel>;
}