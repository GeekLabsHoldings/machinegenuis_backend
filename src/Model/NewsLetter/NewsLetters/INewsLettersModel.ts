import { Types } from "mongoose";
import { IBrand } from "../../Operations/IBrand_interface";

export default interface INewsLettersModel {
    brand: string | Types.ObjectId | IBrand;
    title: string;
    subjectLine: string;
    openingLine: string;
    content: string;
    uploadTime: number;
    userSubscriptionCount: number;
    createdAt: number;

}