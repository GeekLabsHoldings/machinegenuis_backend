import INewsLettersService from "./INewsLetterService";
import { PipelineStage, Types } from "mongoose";
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

    async countNewsLetterByBrandAndDate(brand: string, startDate: number): Promise<any[]> {
        const pipeline: PipelineStage[] = ([
            {
                $match: {
                    brand: brand,
                    createdAt: { $gte: startDate }
                }
            },
            {
                $project: {
                    month: {
                        $month: {
                            $toDate: "$createdAt"
                        }
                    },
                    year: {
                        $year: {
                            $toDate: "$createdAt"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    totalEmails: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            },
            {
                $project: {
                    _id: 0,
                    totalEmails: 1
                }
            }
        ])
        const result = await NewsLettersModel.aggregate(pipeline);
        return result;
    }

}