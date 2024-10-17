const OpenAI = require("openai");
const S3Uploader = require("./uploadToS3");
const getImgs = require("./getImages");
import { duration } from "moment";
import wordsModel from "../../Model/VideoEditing/replacementWords_model";
import { addWordAndReplace_srev } from "../../Service/VideoEditingModule/replaceWords";
const axios = require("axios");

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
          audioPath = await convertTextToAudio(upDatedText, index);
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

        const audioPath = await convertTextToAudio(
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

const convertTextToAudio = async (text, index) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = "Xbs7Hxi9YicGxdbtUTdv";
  console.log("USING ELEVENLABS");

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        responseType: "arraybuffer",
      }
    );

    const audioBuffer = response.data;
    return await S3Uploader.uploadToS3(audioBuffer, index);
  } catch (error) {
    console.error("Error converting text to audio:", error);
    throw error;
  }
};

// const convertTextToAudio = async (text, index) => {
//   try {
//     const response = await openai.audio.speech.create({
//       model: "tts-1",
//       voice: "alloy",
//       input: text,
//     });

//     const audioStream = response.body;
//     return await S3Uploader.uploadToS3(audioStream, index);
//   } catch (error) {
//     console.error("Error converting text to audio:", error);
//     throw error;
//   }
// };

const reConvertTextToAudio = async (text, index) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = "Xbs7Hxi9YicGxdbtUTdv";
  console.log("USING ELEVENLABS");

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        responseType: "arraybuffer",
      }
    );

    const audioBuffer = response.data;
    return await S3Uploader.overWriteToS3(audioBuffer, index);
  } catch (error) {
    console.error("Error converting text to audio:", error);
    throw error;
  }
};

const testAudio = async (req, res) => {
  try {
    const { selectedContent } = req.body;
    if (!selectedContent) {
      return res
        .status(400)
        .json({ success: false, error: "No content provided" });
    }
    const audioPath = await reConvertTextToAudio(selectedContent, "test");
    return res.json({ success: true, audioPath });
  } catch {
    return res
      .status(500)
      .json({ success: false, error: "Error regenerating audio" });
  }
};

const regenrateAudio = async (req, res) => {
  try {
    const { selectedContent, index } = req.body;
    if (!selectedContent || !index) {
      return res
        .status(400)
        .json({ success: false, error: "No content provided" });
    }
    const audioPath = await reConvertTextToAudio(selectedContent, index);
    return res.json({ success: true, audioPath });
  } catch {
    return res
      .status(500)
      .json({ success: false, error: "Error regenerating audio" });
  }
};

const splitAndConvert = async (req, res) => {
  try {
    const { intro, selectedContent } = req.body;
    if (!selectedContent) {
      return res
        .status(400)
        .json({ success: false, error: "No content provided" });
    }

    const slideJson = await generateSlideJson(intro);
    const paragraphJson = await splitContent(selectedContent);

    return res.status(200).json({ success: true, paragraphJson, slideJson });
  } catch {
    return res
      .status(500)
      .json({ success: false, error: "Error processing content" });
  }
};
const splitContentInvestocracy = async (content) => {
  try {
    console.log("Received content:", content);

    const prompt = `Could you please split this content into paragraphs, then give me JUST ONE SINGLE WORD for each paragraph that I can use as a search query on YouTube. 
      Make the word include the name of any famous person mentioned (President, Head of government, etc.) and, if relevant, the name of the government or country. 
      If no such person or government is mentioned, provide a relevant word that captures the main idea of the paragraph.
      Please don't change the original content!
      Here is the content:
      ${content}

      Format the response like this:
      {
          "paragraphs": [
              { "text": "Example paragraph", "keywords": ["single search word"] }
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
          audioPath = await convertTextToAudio(upDatedText, index);
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
const generateIntroKeyword = async (intro) => {
  try {
    const prompt = `Please provide just ONE single, descriptive word that best captures the following content and can be used as a YouTube search keyword.
    Focus on finding the most relevant word related to people, countries, or governments, if applicable.
    Here is the content:
    ${intro}

    Respond in the format:
    {
      "keyword": "YourSingleKeywordHere"
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
    const introKeyword = parsedResult.keyword || "No Keyword Found";

    return { keyword: introKeyword };
  } catch (error) {
    console.error("Error generating keyword for intro:", error);
    throw error;
  }
};

module.exports = {
  splitAndConvert,
  regenrateAudio,
  testAudio,
  convertTextToAudio,
  splitContent,
  splitContentInvestocracy,
  generateIntroKeyword,
};



  const x = {
    intro: {
      text: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
      keywords: [],
      cnbc: {
        videos: [
          { awsLink: "", duration: 0 },
          { awsLink: "", duration: 0 },
          { awsLink: "", duration: 0 }
        ]
      },
      Footage: {
        videos: [
          { awsLink: "", duration: 0 },
          { awsLink: "", duration: 0 },
          { awsLink: "", duration: 0 }
        ],
        audioPath: {
          index: "0-1729161302942",
          url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-0-1729161076854.mp3",
          duration: 0,
        }
      },
    },
    bodyAndOutro: [
      {
        index:0,
        text: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        keywords:[],
        cnbc: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ]
        },
        Footage: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ],
          audioPath: {
            index: "0-1729161302942",
            url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-0-1729161076854.mp3",
            duration: 0,
          }
        },
      },
      {
        index:1,
        text: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        keywords:[],
        cnbc: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ]
        },
        Footage: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ],
          audioPath: {
            index: "0-1729161302942",
            url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-0-1729161076854.mp3",
            duration: 0,
          }
        },
      },
      {
        index:2,
        text: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        keywords:[],
        cnbc: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ]
        },
        Footage: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ],
          audioPath: {
            index: "0-1729161302942",
            url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-0-1729161076854.mp3",
            duration: 0,
          }
        },
      },
      {
        index:3,
        text: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        keywords:[],
        cnbc: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ]
        },
        Footage: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ],
          audioPath: {
            index: "0-1729161302942",
            url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-0-1729161076854.mp3",
            duration: 0,
          }
        },
      },
      {
        index:4,
        text: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        keywords:[],
        cnbc: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ]
        },
        Footage: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ],
          audioPath: {
            index: "0-1729161302942",
            url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-0-1729161076854.mp3",
            duration: 0,
          }
        },
      },{
        index:5,
        text: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        keywords:[],
        cnbc: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ]
        },
        Footage: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ],
          audioPath: {
            index: "0-1729161302942",
            url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-0-1729161076854.mp3",
            duration: 0,
          }
        },
      },
      {
        index:6,
        text: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        keywords:[],
        cnbc: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ]
        },
        Footage: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ],
          audioPath: {
            index: "0-1729161302942",
            url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-0-1729161076854.mp3",
            duration: 0,
          }
        },
      },{
        index:7,
        text: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        keywords:[],
        cnbc: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ]
        },
        Footage: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ],
          audioPath: {
            index: "0-1729161302942",
            url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-0-1729161076854.mp3",
            duration: 0,
          }
        },
      },
      {
        index:8,
        text: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        keywords:[],
        cnbc: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ]
        },
        Footage: {
          videos: [
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 },
            { awsLink: "", duration: 0 }
          ],
          audioPath: {
            index: "0-1729161302942",
            url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-0-1729161076854.mp3",
            duration: 0,
          }
        },
      }
    ]
  };
  