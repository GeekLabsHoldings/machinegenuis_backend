const OpenAI = require("openai");
const S3Uploader = require('./uploadToS3')
const getImgs = require('./getImages');
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const splitContent = async (content) => {
    try {
      const prompt = `Could you please split this content into paragraphs, then give me JUST ONE KEYWORD for each paragraph ONLY ONE KEYWORD !!!,
      I need keword to be names of persons that mentioned in pragraph if this names for famous people (President , Head of governoment , ..)
      IF there are any person mentioned in this paragraph give me name of governomet if mentioned , or name of country, if you dont find any
      anything fo put as keword give me the most important word in this pragraph
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
        messages: [{ role: "user", content: prompt }],
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
      
      const resultObject = await Promise.all(parsedResult.paragraphs.map(async (paragraph, index) => {
        const keywordsAndImages = await Promise.all(paragraph.keywords.map(async (keyword) => {
          const imageUrl = await getImgs.handleSearchImg(keyword);
          return { keyword, imageUrl };
        }));

        const audioPath = await convertTextToAudio(paragraph.text, index);

        return {
          index,
          text: paragraph.text,
          keywordsAndImages,
          audioPath
        };
      }));
  
      return resultObject;
    } catch (error) {
      console.error("Error generating title and content:", error);
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

    
    const slides = await Promise.all(paragraphs.map(async (paragraph, index) => {
      const keywordsAndImages = await Promise.all(paragraph.keywords.map(async (keyword) => {
        const imageUrl = await getImgs.handleSearchImg(keyword);
        return { keyword, imageUrl };
      }));

      const audioPath = await convertTextToAudio(paragraph.text, `S${index + 1}`);

      return {
        index,
        title: paragraph.title, 
        text: paragraph.text,
        keywordsAndImages,
        audioPath
      };
    }));

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

const convertTextToAudio = async (text, index) => {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    const audioStream = response.body; 
    return await S3Uploader.uploadToS3(audioStream, index);
  } catch (error) {
    console.error("Error converting text to audio:", error);
    throw error;
  }
};

const regenrateAudio = async (req , res) => {
  try {
    const { selectedContent , index} = req.body;
    if (!selectedContent || !index) {
      return res.status(400).json({ success: false, error: "No content provided" });
    }
    const audioPath = await convertTextToAudio(selectedContent, index);
    return res.json({ success: true, audioPath });
  }
  catch
  {
    return res.status(500).json({ success: false, error: "Error regenerating audio"})
  }
}

const splitAndConvert = async (req , res) => {
  try {
    const {intro , selectedContent } = req.body;
    if (!selectedContent) {
      return res.status(400).json({ success: false, error: "No content provided" });
    }

    const slideJson = await generateSlideJson(intro);
    const paragraphJson = await splitContent(selectedContent);

    return res
    .status(200)
    .json({ success: true, paragraphJson , slideJson});    
  }
  catch
  {
    return res.status(500).json({ success: false, error: "Error processing content"})
  }
}

module.exports =
{
    splitAndConvert,
    regenrateAudio
}