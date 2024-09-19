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


class SocialMediaNewsLetterController implements ISocialMediaNewsLetterController {


    generateHTMLContent(subjectLine: string, openingLine: string, articles: INewsLetterArticle[]): string {
        let htmlContent = `<h1>${openingLine}</h1><br><h2>${subjectLine}</h2><br><br>`;
        for (const article of articles) {
            htmlContent += `<h3>${article.generalTitle}</h3>`;
            for (const content of article.content) {
                htmlContent += `<a href="https://api.machinegenius.io/un-authorized/news-letter/article/${content.article_id}/[[email]]/[[newLetter_id]]">${content.title}</a><br>`;
            }
        }
        htmlContent += `<br><br><p>Thank you for reading our newsletter</p><br><img src="https://api.machinegenius.io/un-authorized/news-letter/opening-image/[[email]]/[[newLetter_id]]" alt="Opening Image">`;
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
        const emailService = new EmailService();
        const usersSubscriptions = new UserSubscriptionService();
        const users = await usersSubscriptions.getUsersSubscriptionByBrand(job.data.brand);
        let htmlContent = job.data.content.replace(/\[\[newLetter_id]]/g, job.data._id.toString());

        for (const item of users) {
            // Replace the email placeholder for each user
            const personalizedContent = htmlContent.replace(/\[\[email]]/g, item.email);

            const data: MailOptions = {
                to: item.email,
                subject: job.data.subjectLine,
                html: personalizedContent
            };

            await emailService.sendEmail(data);
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