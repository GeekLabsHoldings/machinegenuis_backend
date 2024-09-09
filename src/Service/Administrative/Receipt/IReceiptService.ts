import IReceiptModel from "../../../Model/Administrative/Receipt/IReceiptModel";

export default interface IReceiptService {
    createReceipt(receipt: IReceiptModel): Promise<IReceiptModel>;
    getAllReceipts(page: number, limit: number): Promise<IReceiptModel[]>;
}