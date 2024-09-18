import generatedContentService from "../../Service/ContentCreation/GeneratedContent/GeneratedContentService";
import OpenAiService from "../../Service/OpenAi/OpenAiService";
import PromptService from "../../Service/Prompt/PromptService";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import ReplacePrompt, { promptServiceTypeEnum, systemPromptEnum } from "../../Utils/Prompt";
import ISocialMediaNewsLetterController, { IGeneratedContentResponse, INewsLetter } from "./ISocialMediaNewsLetterController";
import { addJob } from "../../Utils/CronJobs/RedisQueue";
import UserSubscriptionService from "../../Service/NewsLetter/UserSubscription/UserSubscriptionService";
import EmailService, { MailOptions } from "../../Service/Message/EmailService";
import { Job } from "bull";


class SocialMediaNewsLetterController implements ISocialMediaNewsLetterController {

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

    async sendNewsLetter(job: Job<INewsLetter>): Promise<void> {
        console.log("Start Queue");
        const emailService = new EmailService();
        const usersSubscriptions = new UserSubscriptionService();
        const users = await usersSubscriptions.getUsersSubscriptionByBrand(job.data.brand);
        for (const item of users) {
            const data: MailOptions = {
                to: item.email,
                subject: job.data.subjectLine,
                html: `<h1>${job.data.openingLine}</h1><br><h2>${job.data.subjectLine}</h2><br><h3>${job.data.title}</h3><br><h4>${job.data.articles}</h4><img src="https://api.machinegenius.io/un-authorized/news-letter/opening/${item.email}">`
            };
            await emailService.sendEmail(data);
        }
    }

    async scheduleSendEmails(newsData: INewsLetter): Promise<string> {
        const scheduleTime = new Date(newsData.uploadTime);
        await addJob(newsData, scheduleTime);
        return `Email scheduled to be sent at ${scheduleTime}`;
    }


}

export default SocialMediaNewsLetterController;