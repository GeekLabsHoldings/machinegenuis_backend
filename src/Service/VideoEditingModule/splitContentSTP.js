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

const splitContent = async (content) => {
  try {
    console.log("Received content:", content);

    const prompt = `Could you please split this content into paragraphs, then give me JUST ONE KEYWORD for each paragraph ONLY ONE KEYWORD !!!
      I need the keyword to be names of persons mentioned in the paragraph if they are famous (President, Head of government, etc.).
      IF any person is mentioned, give me the name of the government or country if applicable. If no relevant keyword is found, give me the most important word.
      Please don't change the original content!
      Here is the content:
      ${content}

      Format the response like this:
      {
          "paragraphs": [
              { "text": "Example paragraph", "keywords": ["keyword1"] }
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

    var resultObject = await Promise.all(
      parsedResult.paragraphs.map(async (paragraph, index) => {
        console.log(`Processing paragraph ${index + 1}:`, paragraph.text);

        const keywordsAndImages = await Promise.all(
          paragraph.keywords.map(async (keyword) => {
            try {
              console.log(`Fetching image for keyword: ${keyword}`);
              const imageUrl = await getImgs.handleSearchImg(keyword);
              return { keyword, imageUrl };
            } catch (err) {
              console.error(
                `Error fetching image for keyword ${keyword}:`,
                err
              );
              return { keyword, imageUrl: null };
            }
          })
        );

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

        return {
          index,
          text: upDatedText,
          keywordsAndImages,
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

const generateSlideJson = async (intro) => {
  try {
    const prompt = `Could you please split this content into 4 paragraphs, and give me JUST ONE KEYWORD for each paragraph. ONLY ONE KEYWORD !!!
    Focus on person names (President, Head of Government, etc.) and mention any countries or governments when relevant.
    also give me three most important words as TITLE for each splited paragraph
    Here is the content:
    ${intro}

    Respond in the format:
    {
      "paragraphs": [
        {
          "text": "Sample paragraph text...",
          "title": "Policy in canda"
          "keywords": ["Keyword"]
        },
        {
          "text": "Another paragraph text...",
          "title": "people in ..."
          "keywords": ["AnotherKeyword"]
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

    const paragraphs = parsedResult.paragraphs.slice(0, 4);

    const slides = await Promise.all(
      paragraphs.map(async (paragraph, index) => {
        const keywordsAndImages = await Promise.all(
          paragraph.keywords.map(async (keyword) => {
            const imageUrl = await getImgs.handleSearchImg(keyword);
            return { keyword, imageUrl };
          })
        );

        const audioPath = await ttsService.convertTextToAudio(
          paragraph.text,
          `S${index + 1}`
        );

        return {
          index,
          title: paragraph.title,
          text: paragraph.text,
          keywordsAndImages,
          audioPath,
        };
      })
    );

    const slideJson = slides.reverse().reduce((acc, slide, idx) => {
      acc[`slide${4 - idx}Json`] = [slide];
      return acc;
    }, {});

    return slideJson;
  } catch (error) {
    console.error("Error generating slides:", error);
    throw error;
  }
};


module.exports = {
  splitContent,
  generateSlideJson,
};