const OpenAI = require("openai");
require("dotenv").config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const generateTitleAndContent = async (content, myPrompt) => {
  try {
    const prompt = `${myPrompt} Here's the articles: \n\n${content} please give me the response in html format
     without head and body tag by setting any headline in h4 tag and paragraphs in p tag`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message.content.trim();
    const [title, ...newContent] = result.split("\n");
    return {
      title: title.replace("Title: ", "").trim(),
      content: newContent.join(" ").trim(),
    };
  } catch (error) {
    console.error("Error generating title and content:", error);
    throw error;
  }
};

const generateContent = async (req, res) => {
  try {
    const { selectedContent, brandName } = req.body;
    if (!selectedContent || !brandName) {
      return res
        .status(400)
        .json({ success: false, error: "No content or brand name provided" });
    }

    let prompt = "";
    if (brandName == "streetPoliticsCanada") {
      prompt = `Write a Canada-based political script in the third person point of view. It needs to be at least 1700 words that are as human as possible. We have a right-leaning perspective, especially when discussing criticism of the Liberals. Keep the tone professional yet engaging. We stand with Pierre Poilievre and are against Justin Trudeau. The article will need to be divided into three sections.
                Same script format, without the host and scene details.
                1.Intro:-
                Needs to begin with a hooking statement about attention-grabbing news. It needs to be something unique and viral.
                Don’t reveal all the details of the news in this section. Give an introduction of the topic.
                Keep the word limit for this section to 200 words.
                2.Body:
                Keep it from a third person point of view.
                Keep it engaging by throwing in a couple of sarcastic jokes about the Liberals and Justin Trudeau.
                Weave in conspiracy theories related to the topic being discussed.
                Maintain a conversational style, as if entertaining another human with the latest news while keeping a serious undertone.
                Pick the common topics between the chosen articles to flow from one point to another seamlessly.
                Use simpler, commonly used terms.
                3.Outro:
                Make it conversational, yet professional.
                Make the conclusion wrap up all the main ideas from the article and give it a conservative spin
                Don't sound repetitive.
                Ask about the reader's opinions in an engaging manner, wrapping up the script`;
    } else if (brandName == "investocracy") {
      prompt = `Write a stock-market-centered video that is at least 2500 words, using a tone that is human, engaging, professional, ecstatic, storytelling and direct. Write in a third point of view. Maintain a professional, direct tone. it needs to be divided into three parts.
                Intro:
                Needs to begin with a hooking statement about attention-grabbing news. It needs to be something unique and viral in the stock market.
                Don’t reveal all the details of the news in this section. Give a vague introduction of the topic with a word limit of a maximum of 200 words.
                Be straight to the point, start talking about the news right away.
                Make sure to mention the leading companies/figures mentioned in the article in the intro.
                Body:
                Keep it from a third person point of view.
                Keep it engaging by throwing in one sarcastic joke about the stock market and the stock that we talk about.
                Maintain a conversational style, as if entertaining another human with the latest news while keeping a serious undertone.
                Back all the statements you give with proven data to elaborate more on the news.
                Analyze the tweets provided and use them to back up the statements you include.
                Pick the common topics between the chosen articles to flow from one point to another seamlessly.
                Outro:
                Wrap up the article with a persuasive statement to convince the reader to invest in the stock that we talk about.
                Talk about the current state of the stock that we talk about, and include forecasts predicting its growth.
                Highlight the current position of the stock that we talk about.
                End the article with an engaging statement to ask about the reader’s opinions about the topic - Maintain a professional, yet conversational manner.
`;
    } else if (brandName == "movieMyth") {
      prompt = `write a recap of from this content
      write it in detail, giving me a scene by scene explanation, without titles.`;
    }
    else
    {
        return res
        .status(404)
        .json({ success: false, error: "brandName Not correct" });
    }
    const finalArticles = [];
    try {
      const { title, content } = await generateTitleAndContent(
        selectedContent,
        prompt
      );
      finalArticles.push({ title, content });
    } catch (error) {
      console.error("Error generating title and content:", error);
      finalArticles.push({
        title: "Error generating title",
        content: "Failed to process content",
      });
    }

    res.json({ success: true, articles: finalArticles });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  generateContent
};
