import generatedContentService from "../../../../Service/ContentCreation/GeneratedContent/GeneratedContentService";
import OpenAiService from "../../../../Service/OpenAi/OpenAiService";
import PromptService from "../../../../Service/Prompt/PromptService";
import { ErrorMessages } from "../../../../Utils/Error/ErrorsEnum";
import systemError from "../../../../Utils/Error/SystemError";
import ReplacePrompt, { promptServiceTypeEnum, systemPromptEnum } from "../../../../Utils/Prompt";
import ISocialMediaNewsLetterController, { IGeneratedContentResponse, INewsLetterArticle, INewsLetterRequestBody } from "./ISocialMediaNewsLetterController";
import { addJob } from "../../../../Utils/CronJobs/RedisQueue";
import UserSubscriptionService from "../../../../Service/NewsLetter/UserSubscription/UserSubscriptionService";
import EmailService, { MailOptions } from "../../../../Service/Message/EmailService";
import { Job } from "bull";
import INewsLettersModel from "../../../../Model/NewsLetter/NewsLetters/INewsLettersModel";
import NewsLetterService from "../../../../Service/NewsLetter/NewsLetterService/NewsLetterService";
import moment from "../../../../Utils/DateAndTime"
import { Types } from "mongoose";
import EmailsZohoModelService from "../../../../Service/Emails/EmailsZohoModelService";
import EmailZohoService from "../../../../Service/Zoho/Emails/EmailZohoService";
import IZohoEmailModel from "../../../../Model/Zoho/Emails/IZohoEmails";
import { DepartmentEnum } from "../../../../Utils/DepartmentAndRoles";
import { ISendEmailData } from "../../../../Service/Zoho/Emails/IEmailZohoService";


class SocialMediaNewsLetterController implements ISocialMediaNewsLetterController {

    async getAccountEmail(department: string | null, brandId: string | null): Promise<IZohoEmailModel & { _id: Types.ObjectId }> {
        const emailsZohoModelService = new EmailsZohoModelService();
        const senderAccount = await emailsZohoModelService.getEmailAccount(department, brandId);
        if (!senderAccount) {
            return systemError.setStatus(404).setMessage(ErrorMessages.INVALID_EMAILS).throw();
        }
        return senderAccount;
    }

    async setAccountAccessToken(senderAccount: IZohoEmailModel & { _id: Types.ObjectId }) {
        const emailsZohoModelService = new EmailsZohoModelService();
        const { _id, accountId, accessToken, expiredIn, clientId, clientSecret, refreshToken, zohoId } = senderAccount;
        const zohoEmailService = new EmailZohoService(accountId, clientId, clientSecret, zohoId);
        console.log("Expired In", expiredIn);
        if (!expiredIn || expiredIn <= new Date().valueOf()) {
            console.log("Enter Here");
            const accessToken = await zohoEmailService.generateAccessToken(refreshToken);
            const expire = new Date().valueOf() + 3600000;
            await emailsZohoModelService.updateAccessToken((_id.toString()), accessToken, expire);
        }
        else {
            console.log("Set Access Token");
            await zohoEmailService.setAccessToken(accessToken);
        }

        return zohoEmailService;
    }
    generateHTMLContent(subjectLine: string, openingLine: string, articles: INewsLetterArticle[]): string {
        let htmlContent = `<h1>${openingLine}</h1><br><h2>${subjectLine}</h2><br><br>`;
        for (const article of articles) {
            htmlContent += `<h3>${article.generalTitle}</h3>`;
            for (const content of article.content) {
                htmlContent += `<a href="https://api-development.machinegenius.io/un-authorized/news-letter/article/${content.article_id}/[[email]]/[[newLetter_id]]">${content.title}</a><br>`;
            }
        }
        htmlContent += `<br><br><p>Thank you for reading our newsletter</p><br><img src="https://api-development.machinegenius.io/un-authorized/news-letter/opening-image/[[email]]/[[newLetter_id]]" alt="Opening Image">`;
        return htmlContent;
    }
    async getGeneratedNewsLetter(brand: string, stockName: string): Promise<IGeneratedContentResponse[]> {
        const result = generatedContentService.getGeneratedContentData(brand, stockName);
        return result as unknown as IGeneratedContentResponse[];
    }
    async generateNewsLetterTitle(articles: string[]): Promise<string[]> {
        const promptService = new PromptService();
        const openAiService = new OpenAiService();
        const promptData = await promptService.getPromptData(promptServiceTypeEnum.NewsLetterTitle, null);
        if (!promptData) {
            return systemError.setStatus(404).setMessage(ErrorMessages.PROMPT_NOT_FOUND).throw();
        }
        const prompt = ReplacePrompt(promptData.prompt, articles);
        const result = await openAiService.callOpenAiApi(prompt, systemPromptEnum.Array);
        const response = JSON.parse(result.choices[0].message.content as string);
        return response;
    }
    async generateSubjectLineAndOpeningLine(title: string): Promise<string[]> {
        const promptService = new PromptService();
        const openAiService = new OpenAiService();
        const promptData = await promptService.getPromptData(promptServiceTypeEnum.NewsLetterSubjectLineAndOpeningLine, null);
        if (!promptData) {
            return systemError.setStatus(404).setMessage(ErrorMessages.PROMPT_NOT_FOUND).throw();
        }
        const prompt = ReplacePrompt(promptData.prompt, [title]);
        const result = await openAiService.callOpenAiApi(prompt, systemPromptEnum.JSON);
        console.log(result.choices[0].message.content);
        const response = JSON.parse(result.choices[0].message.content as string);
        return response;

    }

    async sendNewsLetter(job: Job<INewsLettersModel & { _id: Types.ObjectId | string }>): Promise<void> {
        console.log("Start Queue");
        const usersSubscriptions = new UserSubscriptionService();
        const senderAccount = await this.getAccountEmail(DepartmentEnum.SocialMedia, (job.data.brand as string));
        const { accountEmail } = senderAccount;
        const zohoEmailService = await this.setAccountAccessToken(senderAccount);
        const users = await usersSubscriptions.getUsersSubscriptionByBrand((job.data.brand as string));
        let htmlContent = job.data.content.replace(/\[\[newLetter_id]]/g, job.data._id.toString());

        for (const item of users) {
            // Replace the email placeholder for each user
            const personalizedContent = htmlContent.replace(/\[\[email]]/g, item.email);

            const emailData: ISendEmailData = {
                fromAddress: accountEmail,
                toAddress: item.email,
                subject: job.data.subjectLine,
                content: personalizedContent,
                askReceipt: 'yes'
            }

            await Promise.all([zohoEmailService.sendEmail(emailData), usersSubscriptions.addReceivedEmails(item.email, (job.data.brand as string))]);
        }
        console.log("End Queue");
    }

    async scheduleSendEmails(newsData: INewsLetterRequestBody): Promise<string> {
        const {
            title,
            subjectLine,
            openingLine,
            articles,
            brand,
            uploadTime
        } = newsData;
        const scheduleTime = new Date(uploadTime);
        const newsLetterService = new NewsLetterService();
        const usersSubscriptions = new UserSubscriptionService();
        const usersCount = await usersSubscriptions.countUsersSubscriptionByBrand(brand);
        const htmlContent = this.generateHTMLContent(subjectLine, openingLine, articles);
        const newsLetterData: INewsLettersModel = {
            brand: newsData.brand,
            title: title,
            subjectLine: subjectLine,
            openingLine: openingLine,
            content: htmlContent,
            userSubscriptionCount: usersCount,
            uploadTime: newsData.uploadTime,
            createdAt: moment().valueOf()
        }
        const createdNewsLetter = await newsLetterService.createNewsLetter(newsLetterData);
        await addJob(createdNewsLetter, scheduleTime);
        return `Email scheduled to be sent at ${scheduleTime}`;
    }


}

export default SocialMediaNewsLetterController;