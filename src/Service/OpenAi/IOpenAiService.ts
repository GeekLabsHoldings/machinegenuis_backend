import OpenAI from 'openai';

export default interface IOpenAiService {
    callOpenAiApi(prompt: string, systemPrompt: string): Promise<OpenAI.ChatCompletion>;
}