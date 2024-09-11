import IReceiptModel from "../../../Model/Administrative/Receipt/IReceiptModel";
import IReceiptController from "./IReceiptController";
import moment from "../../../Utils/DateAndTime";
import receiptService from "../../../Service/Administrative/Receipt/ReceiptService";
import S3_services from "../../../Service/AWS/S3_Bucket/presinedURL";
export default class ReceiptController implements IReceiptController {
    async generateReceiptPresignedUrl(): Promise<string> {
        const s3Service = new S3_services();
        const region = process.env.AWS_REGION as string;
        const bucket = process.env.BUCKET_NAME as string;
        const key = `receipts/${moment().valueOf()}`;
        const url = await s3Service.createPresignedUrlWithClient({ region, bucket, key });
        return url;
    }
    async createReceipt(ReceiptUrl: string, totalPrice: number): Promise<any> {
        const receipt: IReceiptModel = {
            receiptUrl: ReceiptUrl,
            totalPrice,
            createdAt: moment().valueOf()
        }
        const result = await receiptService.createReceipt(receipt);
        return result;
    }
    async getAllReceipts(page: number, limit: number): Promise<any[]> {
        const result = await receiptService.getAllReceipts(page, limit);
        return result;
    }
}