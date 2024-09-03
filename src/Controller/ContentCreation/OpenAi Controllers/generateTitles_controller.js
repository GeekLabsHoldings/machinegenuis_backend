const OpenAI = require('openai');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTitles = async (content, myPrompt) => {
    try {
        const prompt = `${myPrompt} Here's the content: \n\n${content}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "user", content: prompt.trim() },
            ],
        });

        const result = completion.choices[0].message.content.trim();

        console.log("Results-->", result);

        console.log("Check---->" , result.includes("General Title:"));
        
        if (result.includes("General Title:")) {
            const sections = result.split(/\d+\.\s*General Title:\s*/)
                .map(section => section.trim())
                .filter(section => section);

            var structuredResults = sections.map(section => {
                const lines = section.split('\n').map(line => line.trim()).filter(line => line);
                const generalTitle = lines[0].replace('General Title: ', '').trim();
                const id = uuidv4();

                return {
                    id,
                    generalTitle,
                };
            });

            return structuredResults;
        } else {
            return await generateTitles(content, myPrompt);
        }
    } catch (error) {
        console.error("Error generating title and articles:", error);
        throw error;
    }
};

const generateThumbnails = async (content , myPrompt) => {
    try {
        const prompt = `${myPrompt} Here's the content: \n\n${content}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "user", content: prompt.trim() },
            ],
        });

        const result = completion.choices[0].message.content.trim();

        console.log("Results-->"+result)
        const sections = result.split(/\d+\.\s*Thumbnail:\s*/).map(section => section.trim()).filter(section => section);        
        
        console.log("Check---->" , result.includes("Thumbnail:"));
       if(result.includes("Thumbnail:"))
       {
        var structuredResults = sections.map(section => {
            const lines = section.split('\n').map(line => line.trim()).filter(line => line);
            const Thumbnail = lines[0].replace('Thumbnail: ', '').trim();
            const id = uuidv4()

            return {
                id,
                Thumbnail,
            };
        });
       }
       else
       {
        return await generateThumbnails(content , prompt)
       }


        // Return general titles as an array
        return structuredResults;
    } catch (error) {
        console.error("Error generating title and articles:", error);
        throw error;
    }
};

const generateContentTitles = async (req, res) => {
    try {
        const { content, brandName } = req.body;
        if (!content || !brandName) {
            return res
                .status(400)
                .json({ success: false, error: "No content or brand name provided" });
        }

        let prompt = "";
        if (brandName === "streetPoliticsCanada") {
            prompt = `You are given content. Your task is Create at least 10 hooking titles with a maximum of eight words for the topic selected. Make it provocative and aggressive, and include clickbait context..
            Capitalize verbs, mention politician or political party names only when mentioned in the original content. 
            Keywords to include: “EXPOSED, BUSTED LEAKED, SHOCKING, SCANDAL, BREAKING, BETRAYED, MASSIVE, IN PUBLIC, PUBLICLY, CHAOS, INSANE, DESTROY, HUMILIATED, SABOTAGE, UNHINGED, BACKFIRES, OFFICIALLY”

            Return the result in the following format:
            1. General Title: [hooking title here]
            
            2. General Title: [hooking title here]
            and so on ......`;
        } else if (brandName === "streetPoliticsUK") {
            prompt = `You are given content. Your task is Create at least 10 hooking titles with a maximum of eight words for the topic selected. Make it provocative and aggressive, and include clickbait context..
            Capitalize verbs, mention politician or political party names only when mentioned in the original content. 
            Keywords to include: “EXPOSED, BUSTED LEAKED, SHOCKING, SCANDAL, BREAKING, BETRAYED, MASSIVE, IN PUBLIC, PUBLICLY, CHAOS, INSANE, DESTROY, HUMILIATED, SABOTAGE, UNHINGED, BACKFIRES, OFFICIALLY”
            Return the result in the following format:
            1. General Title: [hooking title here]
            
            2. General Title: [hooking title here]
            and so on ......`;
        } else if (brandName === "streetPoliticsAfrica") {
            prompt = `You are given content. Your task is Create at least 10 hooking titles with a maximum of eight words for the topic selected. Make it provocative and aggressive, and include clickbait context..
            Capitalize verbs, mention politician or political party names only when mentioned in the original content. 
            Keywords to include: “EXPOSED, BUSTED LEAKED, SHOCKING, SCANDAL, BREAKING, BETRAYED, MASSIVE, IN PUBLIC, PUBLICLY, CHAOS, INSANE, DESTROY, HUMILIATED, SABOTAGE, UNHINGED, BACKFIRES, OFFICIALLY” 

            Return the result in the following format:
            1. General Title: [hooking title here]
            
            2. General Title: [hooking title here]
            and so on ......`;
        } else if (brandName === "investocracy") {
            prompt = `You are given content. Your task is Create at least 10 hooking titles with a maximum of eight words for the topic selected. Make it ecstatic and positive , and include clickbait context..
            Capitalize verbs. Pick statistics or percentages from the content.

            1. General Title: [hooking title here]
            
            2. General Title: [hooking title here]
            and so on ......`;
        } else if (brandName === "movieMyth") {
            prompt = `You are given content. Your task is Create at least 10 hooking titles with a maximum of eight words for the topic selected. Make it thrilling yet mysterious and suspenseful, and include clickbait context.

            Return the result in the following format:
            1. General Title: [hooking title here]
            
            2. General Title: [hooking title here]`;
        } else {
            return res
                .status(404)
                .json({ success: false, error: "brandName Not correct" });
        }

        const generatedTitles = await generateTitles(content, prompt);
        res.json({ success: true, Titles: generatedTitles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const generateContentThumbnails = async (req, res) => {
    try {
        const { content, brandName } = req.body;
        if (!content || !brandName) {
          return res
            .status(400)
            .json({ success: false, error: "No content or brand name provided" });
        }
        let prompt = "";
        if (brandName === "streetPoliticsCanada") 
        {
            prompt = `Create 10 hooking titles with a maximum of five words for the topic selected. Start with a grasping exclamation of one adjective. Make it in a clickbait and provocative context.
            Capitalize verbs, mention politician or political party names only when mentioned in the original content. 
            Keywords to include: “CHAOS, BUSTED, LEAKED, HECKLED, UNHINGED, BREAKING, OFFICIAL, EXPOSED, SHAMEFUL, RUTHLESS, F**K OFF, DISASTER, CRAZY, BRUTAL, END IS NEAR, INTENSE, , Shame, Scandal, Humiliated, Breaking, Pathetic, Leave, Official,, Savage, Finally, Brutal, Mutiny, Leaked,, Abandoned, Horrible, Insane, Coward”
            TED, LEAKED, HECKLED, UNHINGED, BREAKING, OFFICIAL, EXPOSED, SHAMEFUL, RUTHLESS, F**K OFF, DISASTER, CRAZY, BRUTAL, END IS NEAR, INTENSE, , Shame, Scandal, Humiliated, Breaking, Pathetic, Leave, Official,, Savage, Finally, Brutal, Mutiny, Leaked,, Abandoned, Horrible, Insane, Coward”

            Return the result in the following format:
            
            1. Thumbnail: [hooking title here]
            
            2. Thumbnail: [hooking title here]
            and so on ......`;
        } 
        else if 
        (brandName == "streetPoliticsUK") 
        {
            prompt = `Create 10 hooking titles with a maximum of five words for the topic selected. Start with a grasping exclamation of one adjective. Make it in a clickbait and provocative context.
            Capitalize verbs, mention politician or political party names only when mentioned in the original content.
            Keywords to include: “CHAOS, BUSTED, LEAKED, HECKLED, UNHINGED, BREAKING, OFFICIAL, EXPOSED, SHAMEFUL, RUTHLESS, F**K OFF, DISASTER, CRAZY, BRUTAL, END IS NEAR, INTENSE, , Shame, Scandal, Humiliated, Breaking, Pathetic, Leave, Official,, Savage, Finally, Brutal, Mutiny, Leaked,, Abandoned, Horrible, Insane, Coward”

            Return the result in the following format:-
            
            1. Thumbnail: [hooking title here]
            
            2. Thumbnail: [hooking title here]
            and so on ......`;
        }
        else if 
        (brandName == "streetPoliticsAfrica") 
        {
            prompt = `Create 10 hooking titles with a maximum of five words for the topic selected. Start with a grasping exclamation of one adjective. Make it in a clickbait and provocative context.
                      Capitalize verbs, mention politician or political party names only when mentioned in the original content.
                    Keywords to include: “CHAOS, BUSTED, LEAKED, HECKLED, UNHINGED, BREAKING, OFFICIAL, EXPOSED, SHAMEFUL, RUTHLESS, F**K OFF, DISASTER, CRAZY, BRUTAL, END IS NEAR, INTENSE, , Shame, Scandal, Humiliated, Breaking, Pathetic, Leave, Official,, Savage, Finally, Brutal, Mutiny, Leaked,, Abandoned, Horrible, Insane, Coward”


            Return the result in the following format:-
            
            1. Thumbnail: [hooking title here]
            
            2. Thumbnail: [hooking title here]
            and so on ......`;
        }
        else if 
        (brandName == "investocracy") 
        {
            prompt = `Create 10 hooking thumbnail texts for the topic selected, with a word count of three to four words. Include clickbait context, be mysterious, suspenseful, do not reveal any details from the article, only the name of a stock or an investor, use positive language, and use CALL TO ACTION keywords if applicable.
            Keywords to include : "buy now, time to sell, about to explode, exploding, explosion, impossible, insane, madness, do this or lose, doomed, nothing can stop, changes everything, Double, Last Chance, No one saw this coming, Now, Explode, Never Sell, Spike, Incoming, Hold,This changes everything, Next Year, I Was Wrong, Warning, Lifetime, Doomed, Prepare, Bullish, Survive, Too late "


            Return the result in the following format:-
            
            1. Thumbnail: [hooking title here]
            
            2. Thumbnail: [hooking title here]
            and so on ......`;
        }
        else
        {
            return res
            .status(404)
            .json({ success: false, error: "brandName Not correct" });
        }
        const generatedThumbnail = await generateThumbnails(content , prompt);
        res.json({ success: true, Thumbnail: generatedThumbnail });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export {
    generateContentTitles,
    generateContentThumbnails
}