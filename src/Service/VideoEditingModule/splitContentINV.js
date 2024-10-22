const OpenAI = require("openai");
const S3Uploader = require("./uploadToS3");
const getImgs = require("./getImages");
import { duration } from "moment";
import wordsModel from "../../Model/VideoEditing/replacementWords_model";
import { addWordAndReplace_srev } from "./replaceWords";
import { findYouTubeLinksForKeywords } from "./searchInYoutube";
const axios = require("axios");
const ttsService = require("./TTS");

require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const splitContentInvestocracy = async (content) => {
  try {
    console.log("Received content:", content);

    const prompt = `Please split the content into paragraphs and give me ONE RELEVANT KEYWORD for each paragraph to search for footage on YouTube.
    The keyword should reflect the main idea of each paragraph and be helpful for finding related footage (e.g., market trends, economic outlook). If no clear theme is present, provide a general keyword based on the financial topic. Don't change the original content.

    Here’s the content:
    ${content}

    Format the response like this:
    {
      "paragraphs": [
        { "text": "Example paragraph", "keyword": "market trends" }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "user", content: prompt },
        { role: "system", content: prompt },
      ],
    });

    console.log("Received completion from OpenAI:", completion);

    const rawResult = completion.choices[0].message.content.trim();
    console.log("Trimmed OpenAI response for body---->:", rawResult);

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawResult);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      throw new Error("Invalid JSON response from OpenAI");
    }

    const resultObject = await Promise.all(
      parsedResult.paragraphs.map(async (paragraph, index) => {
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
        const keywords = [{ keyword: paragraph.keyword }];

        const videos = await findYouTubeLinksForKeywords(keywords , false);
        return {
          index,
          text: upDatedText,
          keywords,
          videos,
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
    const prompt = `give me the just ONE ticker or stock name that mintioned in content. and give me three words title 

    Here is the content: ${intro}

    Respond in the format:
    {
      "paragraphs": [
        {
          "text": "Sample paragraph text...",
          "title": "Three-word title",
          "keyword": "TSLA"
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
    const paragraph = parsedResult.paragraphs[0];
    const keywords = [{ keyword: paragraph.keyword }];
    const audioPath = await ttsService.convertTextToAudio(
      paragraph.text,
      `intro`
    );
    const videos = await findYouTubeLinksForKeywords(keywords , true);
    return {
      index: 0, 
      title: paragraph.title,
      text: paragraph.text,
      keywords,
      videos,
      audioPath,
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
