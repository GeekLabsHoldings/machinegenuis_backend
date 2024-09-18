import { Job } from "bull";

export interface INewsLetter {
    title: string;
    subjectLine: string;
    openingLine: string;
    articles: string[];
    brand: string;
    stockName: string;
    uploadTime: number
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
    scheduleSendEmails(newsData: INewsLetter): Promise<string>;
    sendNewsLetter(job: Job<INewsLetter>): Promise<void>
}
