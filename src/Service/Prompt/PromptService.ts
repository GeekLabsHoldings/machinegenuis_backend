import IPromptModel from "../../Model/ContentCreation/Prompts/IPromptModel";
import promptsModel from "../../Model/ContentCreation/Prompts/prompts_model";
import IPromptService from "./IPromptService";

export default class PromptService implements IPromptService {
    async createPrompt(promptData: IPromptModel): Promise<IPromptModel> {
        const prompt = new promptsModel(promptData);
        return await prompt.save();
    }

    async getPromptData(service: string, brand: string | null): Promise<IPromptModel | null> {
        const query = brand ? { service, brand } : { service };
        const prompt = await promptsModel.findOne(query);
        return prompt;
    }


    async updatePrompt(_id: string, promptData: IPromptModel): Promise<IPromptModel | null> {
        return await promptsModel.findByIdAndUpdate(_id, promptData, { new: true });
    }
}