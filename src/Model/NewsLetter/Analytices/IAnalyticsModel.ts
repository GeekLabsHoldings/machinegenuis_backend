import { Types } from "mongoose";
import INewsLettersModel from "../NewsLetters/INewsLettersModel";
import IUserSubscriptionModel from "../UsersSubscriptions/IUserSubscriptionModel";

export default interface IAnalyticsModel {
    email_id: Types.ObjectId | string | INewsLettersModel;
    user_id: Types.ObjectId | string | IUserSubscriptionModel;
    type: string;
    createdAt: number;
}