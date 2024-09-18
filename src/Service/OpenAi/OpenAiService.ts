import { ChatCompletion, Completion } from "openai/resources";
import IOpenAiService from "./IOpenAiService";
import OpenAI from "openai";

export default class OpenAiService implements IOpenAiService {
    openAiAuthorized: OpenAI;
    constructor() {
        const key = process.env.OPENAI_API_KEY as string;
        this.openAiAuthorized = new OpenAI({
            apiKey: key
        });
    }
    async callOpenAiApi(prompt: string, systemPrompt: string): Promise<ChatCompletion> {
        const result = await this.openAiAuthorized.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-4o"
        });
        return result;
    }
}