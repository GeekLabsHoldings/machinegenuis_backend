import IUserSubscriptionModel from "../../../../Model/NewsLetter/UsersSubscriptions/IUserSubscriptionModel";
import AudiencesService from "../../../../Service/NewsLetter/Audiences/AudiencesService";
import NewsLetterService from "../../../../Service/NewsLetter/NewsLetterService/NewsLetterService";
import UserSubscriptionService from "../../../../Service/NewsLetter/UserSubscription/UserSubscriptionService";
import moment, {StartOfLastMonth, StartOfMonth } from "../../../../Utils/DateAndTime";
import IAudienceController, { IAudienceResponse } from "./IAudiencesController";
export default class AudienceController implements IAudienceController {

    async addNewUser(email: string, brand: string): Promise<void> {
        const dateNow = moment()
        const userSubscriptionService = new UserSubscriptionService();
        const audienceService = new AudiencesService();
        const userSubscribeData: IUserSubscriptionModel = {
            brand: brand,
            email: email,
            subscriptionDate: dateNow.valueOf(),
            subscriptionStatus: true,
            updatedAt: dateNow.valueOf()
        };
        await userSubscriptionService.createUserSubscription(userSubscribeData);
        const startOfMonth = StartOfMonth(dateNow);
        await audienceService.updateMonthAudience({
            brand: brand,
            date: startOfMonth,
            count: 1
        });
    }

    async unSubscribeUser(email: string, brand: string): Promise<void> {
        const dateNow = moment()
        const userSubscriptionService = new UserSubscriptionService();
        const audienceService = new AudiencesService();
        await userSubscriptionService.unSubscribeUser(email, brand, dateNow.valueOf());
        const startOfMonth = StartOfMonth(dateNow);
        await audienceService.updateMonthAudience({
            brand: brand,
            date: startOfMonth,
            count: -1
        });

    }
    getAllUsers(brand: string): Promise<string[]> {
        throw new Error("Method not implemented.");
    }
    async getAudiencesAnalysis(brand: string): Promise<IAudienceResponse> {
        const audienceService = new AudiencesService();
        const newsLetter = new NewsLetterService();
        const userSubscription = new UserSubscriptionService();

        const dateNow = moment();
        const startOfLastMonth = StartOfLastMonth(dateNow);

        const allAudiencesFun = audienceService.getAudience(brand);
        const countNewsLetterFun = newsLetter.countNewsLetterByBrandAndDate(brand, startOfLastMonth);
        const countUsersFun = userSubscription.countUsersByBrandAndDate(brand, startOfLastMonth)

        const [allAudiencesResult, countNewsLetterResult, countUsersResult] = await Promise.all([allAudiencesFun, countNewsLetterFun, countUsersFun]);

        let firstMonth = allAudiencesResult[0].date;
        let index = 0;
        let count = 0;
        const result: { year: string, month: string, count: number }[] = [];
        while (firstMonth <= moment().valueOf()) {
            if (allAudiencesResult[index].date === firstMonth) {
                count += allAudiencesResult[index].count;
                index++;
            }
            result.push({
                year: moment(firstMonth).format("YYYY"),
                month: moment(firstMonth).format("MMMM"),
                count: count
            });
            firstMonth = moment(firstMonth).add(1, "month").valueOf();
        }
        const growthPercentageLastMessage = result[result.length - 2].count === 0 ? 0 : parseFloat(((countUsersResult[2].totalCount * 100) / (result[result.length - 2].count)).toFixed(2));
        const growthPercentageThisMessage = parseFloat(((countUsersResult[3].totalCount * 100) / count).toFixed(2));
        return {
            result,
            analysis: {
                New_Subscribers: {
                    this_month: countNewsLetterResult[1].totalEmails,
                    last_month: countNewsLetterResult[0].totalEmails,
                },
                GrowthPercentage: {
                    this_month: growthPercentageThisMessage,
                    last_month: growthPercentageLastMessage
                },
                NewSubscribers: {
                    this_month: countUsersResult[3].totalCount,
                    last_month: countUsersResult[2].totalCount
                },
                UnSubscribers: {
                    this_month: countUsersResult[1].totalCount,
                    last_month: countUsersResult[0].totalCount
                }
            }
        };
    }

}
