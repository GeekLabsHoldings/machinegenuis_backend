import generatedContentService from "../../Service/ContentCreation/GeneratedContent/GeneratedContentService";
import OpenAiService from "../../Service/OpenAi/OpenAiService";
import PromptService from "../../Service/Prompt/PromptService";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import ReplacePrompt, { promptServiceTypeEnum, systemPromptEnum } from "../../Utils/Prompt";
import ISocialMediaNewsLetterController, { IGeneratedContentResponse, INewsLetter } from "./ISocialMediaNewsLetterController";

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
    sendNewsLetterToSubscribers(newsData: INewsLetter): Promise<any> {
        throw new Error("Method not implemented.");
    }


}

export default SocialMediaNewsLetterController;