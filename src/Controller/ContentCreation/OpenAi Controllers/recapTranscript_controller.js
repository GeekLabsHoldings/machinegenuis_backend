const OpenAI = require('openai');
const fs = require('fs');

// OpenAI integration
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const recapContent = async (myContent) => {
    try {
        const prompt = `rewrite this content in good way:-${myContent} `;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "user", content: prompt },
            ]
        });
  
        const result = completion.choices[0].message.content.trim();
        // const [title, ...newContent] = result.split('\n');
        return {
            // title: title.replace("Title: ", "").trim(),
            content: result
        };
    } catch (error) {
        console.error("Error generating recap:", error);
        throw error;
    }
};

const transcribeFile = async (filePath) => 
{
    try {
        const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        response_format: "text",
        });
    
        const generatedScript = await recapContent(transcription);
        return generatedScript;
    } catch (error) {
        console.error("Error during transcription:", error);
        throw new Error('An error occurred during transcription.');
    }
}

export {
    recapContent,
    transcribeFile
}