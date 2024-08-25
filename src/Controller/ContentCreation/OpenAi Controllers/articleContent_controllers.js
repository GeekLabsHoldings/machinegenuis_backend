const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTitleAndContent = async (content) => {
    try {
      console.log("------->"+content.selectedContent)
        const prompt = `Generate a good title and create atractive article from this: \n\n${content.selectedContent}`;
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: prompt },
            ]
        });

        const result = completion.choices[0].message.content.trim();
        const [title, ...newContent] = result.split('\n');
        return {
            title: title.replace("Title: ", "").trim(),
            content: newContent.join(' ').trim()
        };
    } catch (error) {
        console.error("Error generating title and content:", error);
        throw error;
    }
};

const generateContent = async (req, res) => {
    console.log("Received request data:", req.body);

    try {
        const selectedContent = req.body;  // Ensure 'content' is the key in the request body
        if (!selectedContent) {
            return res.status(400).json({ success: false, error: 'No content provided' });
        }

        // Assume finalArticles should be based on selectedContent
        const finalArticles = [];

        try {         
            const { title, content } = await generateTitleAndContent(selectedContent);
            finalArticles.push({ title, content });
        } catch (error) {
            console.error('Error generating title and content:', error);
            finalArticles.push({ title: 'Error generating title', content: 'Failed to process content' });
        }

        res.json({ success: true, articles: finalArticles });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export {
    generateContent
};
