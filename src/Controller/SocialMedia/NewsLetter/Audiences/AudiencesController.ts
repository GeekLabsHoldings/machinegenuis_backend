import axios from "axios";
import IAnalyticsModel from "../../../../Model/NewsLetter/Analytics/Analytics";
import IUserSubscriptionModel from "../../../../Model/NewsLetter/UsersSubscriptions/IUserSubscriptionModel";
import AnalysisNewsLetterService from "../../../../Service/NewsLetter/Analysis/AnalysisService";
import AudiencesService from "../../../../Service/NewsLetter/Audiences/AudiencesService";
import NewsLetterService from "../../../../Service/NewsLetter/NewsLetterService/NewsLetterService";
import UserSubscriptionService from "../../../../Service/NewsLetter/UserSubscription/UserSubscriptionService";
import moment, { EndOfYear, StartOfLastMonth, StartOfMonth, StartOfYear } from "../../../../Utils/DateAndTime";
import { AnalyticsType, UserSubscriptionClass } from "../../../../Utils/NewsLetter";
import IAudienceController, { IAudienceAnalysisResponse, IGrowthPercentage } from "./IAudiencesController";
import systemError from "../../../../Utils/Error/SystemError";
import { ErrorMessages } from "../../../../Utils/Error/ErrorsEnum";
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
        const checkEmailValid = await axios.get(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.HUNTER_API_KEY}`);
        if (checkEmailValid.data.data.status !== "valid") {
            return systemError.setStatus(400).setMessage(ErrorMessages.INVALID_EMAILS).throw();
        }
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
    async getAudiencesAnalysisChart(brand: string, year: number): Promise<Array<number>> {
        const audienceService = new AudiencesService();

        const yearMoment = moment(year);
        const startOfYear = StartOfYear(yearMoment);
        const endOfYear = EndOfYear(yearMoment);

        const allAudiencesResult = await audienceService.getAudience(brand, startOfYear);

        const lastMonth = Math.min(moment().valueOf(), endOfYear);
        let firstMonth = startOfYear;
        let index = 0;
        let count = 0;
        const result: Array<number> = [];

        while (firstMonth <= lastMonth) {
            if (allAudiencesResult[index].date === firstMonth) {
                count += allAudiencesResult[index].count;
                index++;
            }
            result.push(count);
            firstMonth = moment(firstMonth).add(1, "month").valueOf();
        }
        return result;
    }

    async getGrowthPercentage(brand: string): Promise<IGrowthPercentage> {
        const newsLetter = new NewsLetterService();
        const userSubscription = new UserSubscriptionService();
        const dateNow = moment();
        const startOfLastMonth = StartOfLastMonth(dateNow);
        const startOfPreviousLastMonth = StartOfLastMonth(moment(startOfLastMonth));
        const countNewsLetterFun = newsLetter.countNewsLetterByBrandAndDate(brand, startOfLastMonth);
        const countUsersFun = userSubscription.countUsersByBrandAndDate(brand, startOfPreviousLastMonth);
        const [countNewsLetterResult, countUsersResult] = await Promise.all([countNewsLetterFun, countUsersFun]);

        const countNewUsers = await this.getAudiencesAnalysisChart(brand, dateNow.valueOf());

        const [NewSubscribersThisMonth, NewSubscribersLastMonth, UnSubscribersThisMonth, UnSubscribersLastMonth] = [
            countUsersResult[3].totalCount,
            countUsersResult[2].totalCount,
            countUsersResult[1].totalCount,
            countUsersResult[0].totalCount
        ]
        const growthPercentageLastMessage =
            countNewUsers[countNewUsers.length - 2] === 0 ?
                0 : parseFloat((((NewSubscribersLastMonth - UnSubscribersLastMonth) * 100) / countNewUsers[countNewUsers.length - 2]).toFixed(2));
        const growthPercentageThisMessage =
            countNewUsers[countNewUsers.length - 1] === 0 ?
                0 : parseFloat((((NewSubscribersThisMonth - UnSubscribersThisMonth) * 100) / countNewUsers[countNewUsers.length - 1]).toFixed(2));
        return {
            PublishedNewsLetter: {
                this_month: countNewsLetterResult[1].totalEmails,
                last_month: countNewsLetterResult[0].totalEmails,
            },
            GrowthPercentage: {
                this_month: `${growthPercentageThisMessage} % `,
                last_month: `${growthPercentageLastMessage} % `
            },
            NewSubscribers: {
                this_month: NewSubscribersThisMonth,
                last_month: NewSubscribersLastMonth,
            },
            UnSubscribers: {
                this_month: UnSubscribersThisMonth,
                last_month: UnSubscribersLastMonth
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
                const key = `${user.userEmail} - ${user.article_id}`;
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
