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

    const prompt = `Could you please split this content into paragraphs, then give me ONE KEYWORD for each paragraph that I can use as a search query on YouTube.
      The keyword should be a THREE-WORD PHRASE that captures the essence of the paragraph. Focus on stocks and companies mentioned in the content, or phrases that relate to financial markets, companies, or stock performance.
      If no specific companies or stocks are mentioned, provide a relevant phrase that captures the financial theme or main idea of the paragraph.
      Please don't change the original content!
      Here is the content:
      ${content}

      Format the response like this:
      {
          "paragraphs": [
              { "text": "Example paragraph", "keyword": "" }
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

        const videos = await findYouTubeLinksForKeywords(keywords);
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
    const prompt = `give me one keyword for each paragraph? Each keyword should consist of three words and be descriptive enough for searching videos on YouTube. Make sure the keywords include stock names related to the title of each paragraph. Focus on stocks related to markets, companies, and the economy. Also, give me three important words as a title for each paragraph. Here is the content: ${intro}

    Respond in the format:
    {
      "paragraphs": [
        {
          "text": "Sample paragraph text...",
          "title": "CNBC channel",
          "keyword": ""
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
    const keywords = [{ keyword: paragraph.keyword }];
    // Generate audio but return duration as zero
    const audioPath = await ttsService.convertTextToAudio(paragraph.text, `intro`);
    const videos = await findYouTubeLinksForKeywords(keywords);
    return {
      index: 0, // Always return single index
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

