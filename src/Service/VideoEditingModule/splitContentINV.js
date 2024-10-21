const OpenAI = require("openai");
const S3Uploader = require("./uploadToS3");
const getImgs = require("./getImages");
import { duration } from "moment";
import wordsModel from "../../Model/VideoEditing/replacementWords_model";
import { addWordAndReplace_srev } from "./replaceWords";
const axios = require("axios");
const ttsService = require('./TTS')

require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const splitContentInvestocracy = async (content) => {
  try {
    console.log("Received content:", content);

    const prompt = `Could you please split this content into paragraphs, then give me MULTIPLE KEYWORDS for each paragraph that I can use as search queries on YouTube.
      Each keyword should be a THREE-WORD PHRASE that captures the essence of the paragraph. Include the name of any famous person (President, Head of government, etc.) or relevant country/government, if mentioned.
      If no such person or government is mentioned, provide relevant phrases that capture the main idea of the paragraph.
      Please don't change the original content!
      Here is the content:
      ${content}

      Format the response like this:
      {
          "paragraphs": [
              { "text": "Example paragraph", "keywords": ["Three word phrase", "Another three word phrase"] }
          ]
      }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("Received completion from OpenAI:", completion);

    const rawResult = completion.choices[0].message.content.trim();
    console.log("Trimmed OpenAI response for body---->:", rawResult);

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawResult);
      console.log("Parsed OpenAI response for body ----->:", parsedResult);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      throw new Error("Invalid JSON response from OpenAI");
    }

    const resultObject = await Promise.all(
      parsedResult.paragraphs.map(async (paragraph, index) => {
        console.log(`Processing paragraph ${index + 1}:`, paragraph.text);

        const wordsList = await wordsModel.find({});
        const upDatedText = await addWordAndReplace_srev.findAndReplaceWords(
          paragraph.text,
          wordsList
        );

        let audioPath;
        try {
          console.log(`Converting paragraph ${index + 1} to audio...`);
          audioPath = await ttsService.convertTextToAudio(upDatedText, index);
          console.log(`Audio generated for paragraph ${index + 1}:`, audioPath);
        } catch (err) {
          console.error(
            `Error converting text to audio for paragraph ${index}:`,
            err
          );
          audioPath = null;
        }

        if (audioPath) {
          audioPath.duration = 0;
        }

        return {
          index,
          text: upDatedText,
          keywords: paragraph.keywords,
          audioPath,
        };
      })
    );

    console.log("Final processed result:", resultObject);
    return resultObject;
  } catch (error) {
    console.error("Error splitting content:", error);
    throw error;
  }
};

const generateIntroJson = async (intro) => {
  try {
    const prompt = `Could you please split this content into 4 paragraphs, and give me MORE THAN ONE KEYWORD for each paragraph. EACH KEYWORD should be THREE WORDS and descriptive enough for searching videos on YouTube. Focus on person names (President, Head of Government, etc.) and mention any countries or governments when relevant. Also give me three most important words as TITLE for each paragraph. Here is the content: ${intro}

    Respond in the format:
    {
      "paragraphs": [
        {
          "text": "Sample paragraph text...",
          "title": "Policy in Canada",
          "keywords": ["Three Word Keyword", "Another Three Word Keyword"]
        },
        {
          "text": "Another paragraph text...",
          "title": "People in ...",
          "keywords": ["Three Word Keyword", "Another Three Word Keyword"]
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "user", content: prompt },
        { role: "system", content: prompt },
      ],
    });

    const rawResult = completion.choices[0].message.content.trim();
    console.log("Trimmed Response:", rawResult);
    let parsedResult;

    try {
      parsedResult = JSON.parse(rawResult);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      throw new Error("Invalid JSON response from OpenAI");
    }

    const paragraph = parsedResult.paragraphs[0]; // Retrieve the first paragraph only

    const keywordsAndImages = paragraph.keywords.map((keyword) => ({
      keyword,
    }));

    // Generate audio but return duration as zero
    const audioPath = await ttsService.convertTextToAudio(paragraph.text, `S1`);

    return {
      index: 0, // Always return single index
      title: paragraph.title,
      text: paragraph.text,
      keywordsAndImages,
      audioPath: {
        ...audioPath,
        duration: 0, // Always return duration as zero
      },
    };
  } catch (error) {
    console.error("Error generating intro JSON:", error);
    throw error;
  }
};

module.exports = {
  splitContentInvestocracy,
  generateIntroJson,
};
