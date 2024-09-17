import IPromptModel from "../../Model/ContentCreation/Prompts/IPromptModel";

export default interface IPromptService {
    createPrompt(promptData: IPromptModel): Promise<IPromptModel>;
    getPromptData(service: string, brand: string | null): Promise<IPromptModel | null>;
    updatePrompt(_id: string, promptData: IPromptModel): Promise<IPromptModel | null>;
}