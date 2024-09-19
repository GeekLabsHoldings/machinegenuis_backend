import { Job } from "bull";
import { Types } from "mongoose";
import INewsLettersModel from "../../../../Model/NewsLetter/NewsLetters/INewsLettersModel";

export interface INewsLetterArticle {
    generalTitle: string,
    content: [{
        title: string,
        article_id: string,
    }]
}
export interface INewsLetterRequestBody {
    brand: string;
    title: string;
    subjectLine: string;
    openingLine: string;
    articles: [INewsLetterArticle];
    uploadTime: number;
}
export interface IGeneratedContentResponse {
    _id: string;
    generalTitle: string,
    articleJson: [
        {
            title: string,
            content: string,
            date: string,
            time: number,
            brand: string,
            stock: string,
            _id: string,
        }
    ],
    brand: string,
    stock: string,
    createdAt: number
}

export default interface ISocialMediaNewsLetterController {
    getGeneratedNewsLetter(brand: string, stockName: string): Promise<IGeneratedContentResponse[]>;
    generateNewsLetterTitle(articles: string[]): Promise<string[]>;
    generateSubjectLineAndOpeningLine(title: string): Promise<string[]>;
    scheduleSendEmails(newsData: INewsLetterRequestBody): Promise<string>;
    sendNewsLetter(job: Job<INewsLettersModel & { _id: Types.ObjectId | string }>): Promise<void>
}
