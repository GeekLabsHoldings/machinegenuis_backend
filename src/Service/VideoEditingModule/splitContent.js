const OpenAI = require("openai");
const getImgs = require('./getImages');
const servicesTTS = require('./TTS')
require("dotenv").config();
const delayFunc = require("../../Utils/Utilities/delay");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const splitContent = async (content) => {
  try {
    const prompt = `Please split this content into multiple small paragraphs, and then give me just one keyword for each paragraph, only one keyword.
    I need keywords to be names of people mentioned in the paragraph if these names are for famous people (President, Head of government, Politicians ..) Match first and last names from the content. 
    Give me one word to describe feelings for each name.
    IF there is any person mentioned in this paragraph give me the name of the government if mentioned, or the name of the country, if you don't find any
    anything to put as a keyword give me the most important word in this paragraph
    and please don't change the original content EVER!
    Here is the content:
    ${content}

    Give me the response in the following format:
    {
      "paragraphs": [
        {
          "text": "Trudeau have been finished his ....",
          "keywords": ["Trudeau"]
        },
        {
          "text": "Trump ordered the .....",
          "keywords": ["Trump"]
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4", 
      messages: [{ role: "user", content: prompt }, { role: "system", content: prompt }],
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

    const resultObject = [];

    for (let index = 0; index < parsedResult.paragraphs.length; index++) {
      const paragraph = parsedResult.paragraphs[index];
      await delayFunc.delay(1000); 

      const audioPath = await servicesTTS.convertTextToAudio(paragraph.text, index);

      const keywordsAndImages = await Promise.all(paragraph.keywords.map(async (keyword) => {
        const imageUrl = await getImgs.handleSearchImg(keyword);
        return { keyword, imageUrl };
      }));

      resultObject.push({
        index,
        text: paragraph.text,
        keywordsAndImages,
        audioPath, 
      });
    }

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
    also give me main title in one or two words maximum for each splited paragraph 
    Here is the content:
    ${intro}

    Respond in the format:
    {
      "paragraphs": [
        {
          "text": "Sample paragraph text...",
          "title": "Policy"
          "keywords": ["Keyword"]
        },
        {
          "text": "Another paragraph text...",
          "title": "Others"
          "keywords": ["AnotherKeyword"]
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4", 
      messages: [{ role: "user", content: prompt }, { role: "system", content: prompt }],
    });

    const rawResult = completion.choices[0].message.content.trim();
    let parsedResult;

    try {
      parsedResult = JSON.parse(rawResult);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      throw new Error("Invalid JSON response from OpenAI");
    }

    const paragraphs = parsedResult.paragraphs.slice(0, 4);

    const slides = [];

    for (let index = 0; index < paragraphs.length; index++) {
      const paragraph = paragraphs[index];
     
      await delayFunc.delay(3000); 

      const keywordsAndImages = await Promise.all(paragraph.keywords.map(async (keyword) => {
        const imageUrl = await getImgs.handleSearchImg(keyword);
        return { keyword, imageUrl };
      }));

      const audioPath = await servicesTTS.convertTextToAudio(paragraph.text, `S${index + 1}`);

      slides.push({
        index,
        title: paragraph.title, 
        text: paragraph.text,
        keywordsAndImages,
        audioPath,
      });
    }

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


module.exports =
{
  splitContent,
  generateSlideJson
}