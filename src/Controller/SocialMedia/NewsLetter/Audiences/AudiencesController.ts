import IAnalyticsModel from "../../../../Model/NewsLetter/Analytics/Analytics";
import IUserSubscriptionModel from "../../../../Model/NewsLetter/UsersSubscriptions/IUserSubscriptionModel";
import AnalysisNewsLetterService from "../../../../Service/NewsLetter/Analysis/AnalysisService";
import AudiencesService from "../../../../Service/NewsLetter/Audiences/AudiencesService";
import NewsLetterService from "../../../../Service/NewsLetter/NewsLetterService/NewsLetterService";
import UserSubscriptionService from "../../../../Service/NewsLetter/UserSubscription/UserSubscriptionService";
import moment, { StartOfLastMonth, StartOfMonth } from "../../../../Utils/DateAndTime";
import { AnalyticsType, UserSubscriptionClass } from "../../../../Utils/NewsLetter";
import IAudienceController, { IAudienceAnalysisResponse, IAudienceResponse } from "./IAudiencesController";
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
            receivedEmails: 0,
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

    async getAudiencesEmails(brand: string, queryType: string): Promise<IAudienceAnalysisResponse[]> {
        const userSubscriptionService = new UserSubscriptionService();
        const analysisService = new AnalysisNewsLetterService();
        const getUserFun = userSubscriptionService.getUsersReceivedEmails(brand);
        const getAnalysisFun = analysisService.getUsersEmailsAnalysis(brand);
        const [users, analysis] = await Promise.all([getUserFun, getAnalysisFun]);
        const userNumberReceivedEmails: Map<string, IUserSubscriptionModel> = new Map();
        users.forEach(user => {
            userNumberReceivedEmails.set(user.email, user);
        });

        const userEmailsAction: Record<string, { openingCount: number, clickCount: number }> = {};
        const oneClickOpening: Set<string> = new Set();
        analysis.forEach((user: IAnalyticsModel) => {
            if (!userEmailsAction[user.userEmail]) {
                userEmailsAction[user.userEmail] = {
                    openingCount: 0,
                    clickCount: 0
                };
            }
            if (user.type === AnalyticsType.OPEN) {
                userEmailsAction[user.userEmail].openingCount++;
            } else {
                const key = `${user.userEmail}-${user.article_id}`;
                if (!oneClickOpening.has(key)) {
                    oneClickOpening.add(key);
                    userEmailsAction[user.userEmail].clickCount++;
                }
            }
        });


        const result: IAudienceAnalysisResponse[] = [];
        userNumberReceivedEmails.forEach((value: IUserSubscriptionModel, key: string) => {
            const mid = Math.floor(value.receivedEmails / 2);
            const userAction = userEmailsAction[key] ? userEmailsAction[key] : { openingCount: 0, clickCount: 0 }

            const interactivity = (userAction.openingCount + userAction.clickCount) / 2;
            const contactRating = parseFloat(((interactivity * 5) / value.receivedEmails).toFixed(2));

            const firstClassCondition = queryType === UserSubscriptionClass.FirstClass && userAction.openingCount >= mid && userAction.clickCount >= mid;
            const secondClassCondition = queryType === UserSubscriptionClass.SecondClass && userAction.openingCount >= mid && userAction.clickCount < mid;
            const thirdClassCondition = queryType === UserSubscriptionClass.ThirdClass && userAction.openingCount < mid && userAction.clickCount < mid;


            if (firstClassCondition || secondClassCondition || thirdClassCondition) {
                result.push({
                    email: key,
                    contactRating,
                    brand,
                    subscription: value.subscriptionStatus,
                    createdAt: value.subscriptionDate
                });
            }
        });
        return result;


    }

}
