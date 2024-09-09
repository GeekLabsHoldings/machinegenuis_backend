import IReceiptModel from "../../../Model/Administrative/Receipt/IReceiptModel";

export default interface IReceiptController {
    generateReceiptPresignedUrl(): Promise<string>;
    createReceipt(ReceiptUrl: string): Promise<IReceiptModel>;
    getAllReceipts(page: number, limit: number): Promise<IReceiptModel[]>;
}