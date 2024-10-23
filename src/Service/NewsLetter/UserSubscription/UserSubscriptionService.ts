import { PipelineStage, Types } from "mongoose";
import IUserSubscriptionModel from "../../../Model/NewsLetter/UsersSubscriptions/IUserSubscriptionModel";
import UserSubscriptionModel from "../../../Model/NewsLetter/UsersSubscriptions/UserSubscriptionModel";
import IUserSubscriptionService from "./IUserSubscriptionService";

export default class UserSubscriptionService implements IUserSubscriptionService {
    async createUserSubscription(userData: IUserSubscriptionModel): Promise<IUserSubscriptionModel> {
        const newUserSubscription = new UserSubscriptionModel(userData);
        const result = await newUserSubscription.save();
        return result;
    }
    async getUsersSubscriptionByBrand(brand: string): Promise<IUserSubscriptionModel[]> {
        return await UserSubscriptionModel.find({ brand, subscriptionStatus: true });
    }

    async countUsersSubscriptionByBrand(brand: string): Promise<number> {
        return await UserSubscriptionModel.countDocuments({ brand, subscriptionStatus: true });
    }

    async unSubscribeUser(email: string, brand: string, updatedAt: number,): Promise<void> {
        await UserSubscriptionModel.findOneAndUpdate({ email, brand }, { $set: { subscriptionStatus: false, updatedAt } });
    }

    async countUsersByBrandAndDate(brand: string, startDate: number): Promise<any> {
        const brandId = new Types.ObjectId(brand);
        const pipeline: PipelineStage[] = ([
            {
                $match: {
                    brand: brand,
                    updatedAt: { $gte: startDate }
                }
            },
            {

                $project: {
                    month: {
                        $month: {
                            $toDate: "$subscriptionDate"
                        }
                    },
                    year: {
                        $year: {
                            $toDate: "$subscriptionDate"
                        }
                    },
                    subscriptionStatus: 1
                }
            },
            {
                $group: {
                    _id: { year: '$year', month: '$month', subscriptionStatus: '$subscriptionStatus' },
                    totalCount: { $sum: 1 }
                }
            },
            {
                $facet: {
                    results: [
                        {
                            $group: {
                                _id: { year: '$_id.year', month: '$_id.month' },
                                counts: {
                                    $push: {
                                        subscriptionStatus: '$_id.subscriptionStatus',
                                        totalCount: '$totalCount'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                year: '$_id.year',
                                month: '$_id.month',
                                counts: {
                                    $concatArrays: [
                                        [{ subscriptionStatus: false, totalCount: 0 }],
                                        [{ subscriptionStatus: true, totalCount: 0 }],
                                        '$counts'
                                    ]
                                }
                            }
                        },
                        { $unwind: '$counts' },
                        {
                            $group: {
                                _id: {
                                    year: '$year',
                                    month: '$month',
                                    subscriptionStatus: '$counts.subscriptionStatus'
                                },
                                totalCount: { $max: '$counts.totalCount' }
                            }
                        },
                        {
                            $sort: {
                                "_id.year": 1,
                                "_id.subscriptionStatus": 1,
                                "_id.month": 1
                            }
                        }
                    ]
                }
            },
            { $unwind: '$results' },
            {
                $project: {
                    _id: 0,
                    month: '$results._id.month',
                    subscriptionStatus: '$results._id.subscriptionStatus',
                    totalCount: '$results.totalCount'
                }
            }
        ]);
        const result = await UserSubscriptionModel.aggregate(pipeline);
        return result;
    }

    async addReceivedEmails(email: string, brand: string): Promise<void> {
        await UserSubscriptionModel.updateOne({ email, brand }, { $inc: { receivedEmails: 1 } });
    }

    async getUsersReceivedEmails(brand: string): Promise<IUserSubscriptionModel[]> {
        return await UserSubscriptionModel.find({ brand });
    }

}