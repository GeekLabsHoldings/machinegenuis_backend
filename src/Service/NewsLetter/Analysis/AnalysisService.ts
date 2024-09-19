
import AnalyticsModel from "../../../Model/NewsLetter/Analytics/AnalyticsModel";
import IAnalyticsModel from "../../../Model/NewsLetter/Analytics/Analytics";
import IAnalysisNewsLetterService, { IAnalysisNewsLetterServiceResponseService } from "./IAnalysisService";
import { PipelineStage, SchemaTypes } from "mongoose";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import { AnalyticsType } from "../../../Utils/NewsLetter";

export default class AnalysisNewsLetterService implements IAnalysisNewsLetterService {
    async createNewsLetterAnalysis(data: IAnalyticsModel): Promise<void> {
        await AnalyticsModel.findOneAndUpdate({
            email: data.email,
            userEmail: data.userEmail,
            type: data.type,
            article_id: data.article_id
        }, data, { upsert: true, new: true })
    }

    async getNewsLetterAnalysis(brand: string): Promise<IAnalysisNewsLetterServiceResponseService[]> {
        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: `${SchemaTypesReference.NewsLetters}s`, 
                    localField: 'email',
                    foreignField: '_id',
                    as: 'newsletterDetails'
                }
            },
            {
                $unwind: '$newsletterDetails'
            },
            {
                $match: {
                    'newsletterDetails.brand': brand
                }
            },
            {
                $group: {
                    _id: '$email', 
                    openingCount: {
                        $sum: {
                            $cond: [{ $eq: ['$type', AnalyticsType.OPEN] }, 1, 0]
                        }
                    },
                    clickCount: {
                        $sum: {
                            $cond: [{ $eq: ['$type', AnalyticsType.CLICK] }, 1, 0]
                        }
                    },
                    title: { $first: '$newsletterDetails.title' }, 
                    brand: { $first: '$newsletterDetails.brand' }, 
                    createdAt: { $first: '$newsletterDetails.createdAt' }, 
                    userSubscriptionCount: { $first: '$newsletterDetails.userSubscriptionCount' } 
                }
            },
            {
                $project: {
                    _id: 0,
                    email: {
                        _id: '$_id', 
                        title: '$title',
                        brand: '$brand'
                    },
                    openingCount: 1,
                    clickCount: 1,
                    createdAt: 1,
                    userSubscriptionCount: 1
                }
            },
            {
                $sort: {
                    createdAt: -1 
                }
            }
        ];
        
        const result = await AnalyticsModel.aggregate(pipeline);
        return result;
        
    }

}