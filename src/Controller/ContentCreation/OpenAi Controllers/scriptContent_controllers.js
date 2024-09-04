const OpenAI = require("openai");
require("dotenv").config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const promptsController = require('../Prompts Database/promptsDB_controller')

const generateTitleAndContent = async (content, myPrompt) => {
  try {
    if (myPrompt === "HTML") {
      var prompt = `Here's the articles: \n\n ${content} get this content in html format like this structure:-  
        <h4>Intro</h4>
        <p>[Your introductory text here]</p>
        <h4>Body</h4>
        <p>[Your main content here]</p>
        <h4>Outro</h4>
        <p>[Your closing statement here]</p>
        NOTE*  PLEASE I NEED THE ORIGINAL ARTICLE , DON'T EDIT ON IT ANY WAAAAAAAAAAAAAY!!!
        `;
    } else {
      var prompt = `${myPrompt} Here's the articles: \n\n${content} get this content in html format like this structure:-  
        <h4>Intro</h4>
        <p>[Your introductory text here]</p>
        <h4>Body</h4>
        <p>[Your main content here]</p>
        <h4>Outro</h4>
        <p>[Your closing statement here]</p>
        NOTE*  PLEASE I NEED THE ORIGINAL ARTICLE , DON'T EDIT ON IT ANY WAAAAAAAAAAAAAY!!!
        `;
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message.content.trim();
    const [...newContent] = result;
    return {
      content: newContent.join(""),
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
      prompt = await promptsController.get_brand_prompts(brandName , "script");
      console.log(prompt).join("");
      
    } else if (brandName == "streetPoliticsUK") {
      prompt = `Write a UK-based political script in the third person point of view. It needs to be at least 1700 words that are as human as possible. We have a right-leaning perspective, especially when discussing criticism of the government and the current Prime Minister. Keep the tone professional yet engaging. We stand with the people and are against the government, house of commons,  political parties, Politicians and the Prime Minister. The article will need to be divided into three sections.
              Same script format, without the host and scene details.
              IF Keir Starmer, the labor party or the tories are mentioned, we must criticize them heavily. Do not mention Keir Starmer unless it is stated in the original content.

              1.Intro:-
              Needs to begin with a hooking statement about attention-grabbing news. It needs to be something unique and viral.
              Don’t reveal all the details of the news in this section. Give an introduction of the topic.
              Keep the word limit for this section to 200 words.
              2.Body:
              Keep it from a third person point of view.
              Keep it engaging by throwing in a couple of sarcastic jokes about the government and the political parties.
              Weave in conspiracy theories related to the topic being discussed.
              Maintain a conversational style, as if entertaining another human with the latest news while keeping a serious undertone.
              Pick the common topics between the chosen articles to flow from one point to another seamlessly.
              Use simpler, commonly used terms.
              3.Outro:
              Make it conversational, yet professional.
              Make the conclusion wrap up all the main ideas from the article and give it a sarcastic spin
              Don't sound repetitive.
              Ask about the reader's opinions in an engaging manner, wrapping up the script.`;
    } else if (brandName == "streetPoliticsAfrica") {
      prompt = `Write an Africa-based political script in the third person point of view. It needs to be at least 1700 words that are as human as possible. We have a Africa-centered perspective, especially when discussing criticism of the west. Keep the tone professional yet engaging. We stand with the people and are against western countries involvement in Africa and non-African countries attempts to destabilize Africa..Defend African sovereignty and unity. The article will need to be divided into three sections.
                Same script format, without the host and scene details.
                [IF CONDITION] Canada is mentioned in the original content, criticizing specifically the Canadian Liberal government and Trudeau. Do not mention Canada unless it is stated in the original content.
                IF Any country that’s an ally to African countries is mentioned; praise it.
                DO NOT mention or include Egypt.
                1.Intro:-
                Needs to begin with a hooking statement about attention-grabbing news. It needs to be something unique and viral.
                Don’t reveal all the details of the news in this section. Give an introduction of the topic.
                Keep the word limit for this section to 200 words.
                2.Body:
                Keep it from a third person point of view.
                Keep it engaging by throwing in a couple of sarcastic jokes about the western countries interfering with African matters, Weave in conspiracy theories related to the topic being discussed.
                Maintain a conversational style, as if entertaining another human with the latest news while keeping a serious undertone.
                Pick the common topics between the chosen articles to flow from one point to another seamlessly.
                Use simpler, commonly used terms.
                3.Outro:
                Make it conversational, yet professional.
                Make the conclusion wrap up all the main ideas from the article and give it a sarcastic spin
                Don't sound repetitive.
                Ask about the reader's opinions in an engaging manner, wrapping up the script.`;
    } else if (brandName == "investocracy") {
      prompt = `Write a stock-market-centered video that is at least 2500 words, using a tone that is human, engaging, professional, ecstatic, storytelling and direct. Write in a third point of view. Maintain a professional, direct tone. it needs to be divided into three parts.
                Intro:
                Needs to begin with a hooking statement about attention-grabbing news. It needs to be something unique and viral in the stock market.
                Don’t reveal all the details of the news in this section. Give a vague introduction of the topic with a word limit of a maximum of 200 words.
                Be straight to the point, start talking about the news right away.
                Make sure to mention the leading companies/figures mentioned in the article in the intro.
                Body:
                Keep it from a third person point of view.
                Keep it engaging by throwing in one joke about the stock market and the stock that we talk about.
                Maintain a conversational style, as if entertaining another human with the latest news while keeping a serious undertone.
                Back all the statements you give with proven data to elaborate more on the news.
                Analyze the tweets provided and use them to back up the statements you include.
                Pick the common topics between the chosen articles to flow from one point to another seamlessly.
                Outro:
                Wrap up the article with a persuasive statement to convince the reader to invest in the stock that we talk about.
                Talk about the current state of the stock that we talk about, and include forecasts predicting its growth.
                Highlight the current position of the stock that we talk about.
                End the article with an engaging statement to ask about the reader’s opinions about the topic - Maintain a professional, yet conversational manner..`;
    } else if (brandName == "movieMyth") {
      prompt = `Write me a movie recap for this transcript use storytelling format and write it in third person point of view, divide it into timestamps whereas each paragraph is 3 seconds only. Total maximum duration is 20 minutes. Write it in a suspenseful tone, apply emotions when applicable.`;
    } else {
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

const convertContentTo_HTML = async (req, res) => {
  try {
    const { contentBody } = req.body;
    if (!contentBody) {
      return res
        .status(400)
        .json({ success: false, error: "No content provided" });
    }

    const finalArticles = [];
    let prompt = "HTML";
    try {
      const { title, content } = await generateTitleAndContent(
        contentBody,
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

export { generateContent, convertContentTo_HTML };
