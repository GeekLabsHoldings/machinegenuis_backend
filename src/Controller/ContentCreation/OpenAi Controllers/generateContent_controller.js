import moment from "moment-timezone";
import generatedContentModel from "../../../Model/ContentCreation/Generated/GeneratedContent_Model";
import scrapedModel from "../../../Model/ContentCreation/Scraped/scraped_model";
import generatedContentService from "../../../Service/ContentCreation/GeneratedContent/GeneratedContentService";
const scrapedDBControllers = require("../Scraped DB Controller/scrapedDB_controller");
import "dotenv/config";
const mongoose = require("mongoose");
const OpenAI = require("openai");
require("dotenv").config();
const axios = require("axios");
console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateTitleAndArticles = async (brandName, stockName) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const articles = await scrapedDBControllers.getScrapedData(
      brandName,
      stockName,
      session
    );
    const articlesTitles = articles
      .map((item, index) => `Title: ${item.title}`)
      .join("\n\n");
    // Create a detailed prompt explaining the task
    const prompt = `
            You are given a list of article titles. Your task is to group these titles that talk about same news or event under specific and detailed relevant headings provide a title for each group. Also, return any titles that do not fit into any group separately.
            Here are the article titles:
            
            ${articlesTitles}
            
            Please group the articles under suitable general titles and identify articles that do not fit into any group.
            
            Return the result in the following format:
            
            1. General Title: [General title here]
                - Title: [Article title here]
                - Title: [Article title here]
            
            2. General Title: [General title here]
                - Title: [Article title here]
                - Title: [Article title here]
            
            3. General Title: Not Related to Each Other:
                - Title: [Article title here]
                - Title: [Article title here]
        `;

    // Send the prompt to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt.trim() }],
    });

    // Extract the response and format it
    const result = completion.choices[0].message.content.trim();

    const sections = result
      .split(/\d+\.\s*General Title:\s*/)
      .map((section) => section.trim())
      .filter((section) => section);

    const structuredResults = sections.map((section) => {
      const articleJson = [];
      const lines = section
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);
      const generalTitle = lines[0].replace("General Title: ", "").trim();
      const articleTitles = lines
        .slice(1)
        .map((line) => line.replace("- Title: ", "").trim());

      for (let i = 0; i < articleTitles.length; i++) {
        for (let j = 0; j < articles.length; j++) {
          if (articleTitles[i] == articles[j].title) {
            articleJson.push(articles[j]);
          }
        }
      }

      return {
        generalTitle,
        articleJson,
        brand: brandName,
        stock: stockName,
        createdAt: moment().valueOf(),
      };
    });
    const query = { brand: brandName };
    if (stockName) {
      query.stock = stockName;
    }

    await generatedContentService.deleteGeneratedContent(
      brandName,
      stockName,
      session
    );
    console.log("Structured Results");
    await generatedContentService.CreateGeneratedContent(
      structuredResults,
      session
    );
    await session.commitTransaction();
    return;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error generating title and articles:", error);
    return;
  } finally {
    await session.endSession();
  }
};

const generateContent = async (req, res) => {
  try {
    const brandName = req.body.brandName;
    const stockName = req.body.stockName;

    if (!brandName) {
      return res
        .status(400)
        .json({ success: false, error: "No brand Name provided" });
    }

    const scrapeResponse =
      await generatedContentService.getGeneratedContentData(
        brandName,
        stockName
      );

    if (!scrapeResponse || scrapeResponse.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No content found for the given brand and stock",
      });
    }

    return res.json({ success: true, organizedArticles: scrapeResponse });
  } catch (error) {
    console.error("Error in generateContent:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export { generateContent, generateTitleAndArticles };
