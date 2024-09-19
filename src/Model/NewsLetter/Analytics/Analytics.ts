import { Types } from "mongoose";
import INewsLettersModel from "../NewsLetters/INewsLettersModel";
import IUserSubscriptionModel from "../UsersSubscriptions/IUserSubscriptionModel";

export default interface IAnalyticsModel {
    email: Types.ObjectId | string | INewsLettersModel;
    userEmail: string;
    article_id: string;
    type: string;
    createdAt: number;
}