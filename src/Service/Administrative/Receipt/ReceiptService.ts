import IReceiptModel from "../../../Model/Administrative/Receipt/IReceiptModel";
import ReceiptModel from "../../../Model/Administrative/Receipt/ReceiptModel";
import IReceiptService from "./IReceiptService";

class ReceiptService implements IReceiptService {
    async createReceipt(receipt: IReceiptModel): Promise<IReceiptModel> {
        const newReceipt = new ReceiptModel(receipt);
        const result = await newReceipt.save();
        return result;
    }

    async getAllReceipts(page: number, limit: number): Promise<IReceiptModel[]> {
        return await ReceiptModel.find().sort({ createdAt: -1 })
            .skip((page - 1) * limit).limit(limit);
    }
}

const receiptService = new ReceiptService();

export default receiptService;