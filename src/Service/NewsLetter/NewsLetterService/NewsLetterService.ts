import INewsLettersService from "./INewsLetterService";
import { Types } from "mongoose";
import INewsLettersModel from "../../../Model/NewsLetter/NewsLetters/INewsLettersModel";
import NewsLettersModel from "../../../Model/NewsLetter/NewsLetters/NewSubscriptionsModel";

export default class NewsLetterService implements INewsLettersService {
    async createNewsLetter(newsLetter: INewsLettersModel): Promise<INewsLettersModel & { _id: Types.ObjectId | string }> {
        const newsLetterData = new NewsLettersModel(newsLetter);
        const result = await newsLetterData.save();
        return result;
    }

    async getNewsLetterByBrand(brand: string): Promise<INewsLettersModel[]> {
        const result = await NewsLettersModel.find({ brand });
        return result;
    }

}