import { Types } from "mongoose";
import INewsLettersModel from "../../../Model/NewsLetter/NewsLetters/INewsLettersModel";

export default interface INewsLettersService {
    createNewsLetter(newsLetter: INewsLettersModel): Promise<INewsLettersModel & { _id: Types.ObjectId | string }>;
    getNewsLetterByBrand(brand: string): Promise<INewsLettersModel[]>;
}