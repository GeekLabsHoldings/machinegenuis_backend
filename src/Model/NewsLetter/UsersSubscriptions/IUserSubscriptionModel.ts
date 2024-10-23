import { Types } from "mongoose";
import { IBrand } from "../../Operations/IBrand_interface";

export default interface IUserSubscriptionModel {
    email: string;
    brand: Types.ObjectId | string | IBrand;
    subscriptionDate: number;
    subscriptionStatus: boolean;
    receivedEmails: number;
    updatedAt: number
}