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
          audioPath = await convertTextToAudio(upDatedText, index);
          console.log(`Audio generated for paragraph ${index + 1}:`, audioPath);
        } catch (err) {
          console.error(
            `Error converting text to audio for paragraph ${index}:`,
            err
          );
          audioPath = null;
        }

        // Override duration with 0
        if (audioPath) {
          audioPath.duration = 0; // Always return duration as zero
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
    const audioPath = await convertTextToAudio(paragraph.text, `S1`);

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
  splitAndConvert,
  regenrateAudio,
  testAudio,
  convertTextToAudio,
  splitContent,
  splitContentInvestocracy,
  generateIntroJson,
};

const y = {
  intro: {
    index: 0,
    title: "Semiconductor World Evolution",
    text: "In the dynamic and ever-evolving world of semiconductors, groundbreaking developments are taking place that are impossible to ignore, even by the staunchest critics. At the heart of these seismic shifts is Nvidia, a tech juggernaut that has navigated the complexities of artificial intelligence to become one of the most valuable and influential companies in the world.",
    keywordsAndImages: [
      {
        keyword: "Semiconductor Groundbreaking Developments",
      },
      {
        keyword: "Nvidia Artificial Intelligence",
      },
    ],
    cnbcVideos: [
      { awsLink: "", duration: 0 },
      { awsLink: "", duration: 0 },
      { awsLink: "", duration: 0 },
    ],

    FootageVideos: [
      { awsLink: "", duration: 0 },
      { awsLink: "", duration: 0 },
      { awsLink: "", duration: 0 },
    ],
    audioPath: {
      index: "S1-1729263533012",
      url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-S1-1729263533012.mp3",
      duration: 0,
    },
  },
  bodyOutro: [
    {
      index: 0,
      text: "The body of Jensen Huang's rise from humble beginnings, cleaning toilets to leading boardroom discussions at Nvidia, mirrors the dramatic ascent of the company he leads. This story is not just about financial success but also about resilience, vision, and the pivotal role of silicon chips in driving future technologies. Under Huang's stewardship, Nvidia has captured a staggering market share of 70% to 95% market share in AI processors, essential for advanced models like ChatGPT. This dominance illustrates the literal presence of having a chip on your shoulder.",
      keywords: [
        "Jensen Huang's rise",
        "Nvidia market dominance",
        "AI processors market",
      ],
      cnbcVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],

      FootageVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],
      audioPath: {
        index: "0-1729263597301",
        url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-0-1729263597301.mp3",
        duration: 0,
      },
    },
    {
      index: 1,
      text: "Huang's own wealth has witnessed an exponential rise from a modest $3.8 billion to an astounding $106 billion, placing him 13th among global billionaires. Despite this success, Nvidia's towering presence has sparked debates within the investment community. The company's market capitalization has transcended what many thought possible, with shares surging over 170% last year.",
      keywords: [
        "Huang's wealth rise",
        "Nvidia investment debates",
        "Nvidia market capitalization",
      ],
      cnbcVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],

      FootageVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],
      audioPath: {
        index: "1-1729263593924",
        url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-1-1729263593924.mp3",
        duration: 0,
      },
    },
    {
      index: 2,
      text: "However, experts have raised concerns about Nvidia's dependence on semiconductor mammoths like Taiwan Semiconductor Manufacturing Co and its heavy reliance on a concentrated customer base. Some critics argue that Nvidia risks putting all its eggs in one basket, while others see these strategic collaborations as necessary for industry advancement, highlighting the fine balance between risk and resourceful opportunity.",
      keywords: [
        "Nvidia semiconductor dependence",
        "Nvidia customer base",
        "Industry advancement collaborations",
      ],
      cnbcVideos: [
        { awsLink: "aws video", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],

      FootageVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],
      audioPath: {
        index: "2-1729263593977",
        url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-2-1729263593977.mp3",
        duration: 0,
      },
    },
    {
      index: 3,
      text: "Nvidia is not only fueling growth but also driving an ethos of philanthropy, albeit amidst controversy. The Huang Foundation's fund allocations into Donor-Advised Funds (DAFs) have attracted criticism for their lack of transparency, suggesting that these philanthropic efforts might be more impactful if conducted more openly.",
      keywords: [
        "Nvidia philanthropic growth",
        "Huang Foundation controversy",
        "Donor-Advised Funds criticism",
      ],
      cnbcVideos: [
        { awsLink: "aws video", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],

      FootageVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],
      audioPath: {
        index: "3-1729263592983",
        url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-3-1729263592983.mp3",
        duration: 0,
      },
    },
    {
      index: 4,
      text: "By 2022, the foundation's assets had ballooned to an impressive $1 billion, underscoring Huang's steadfast commitment to societal causes, education, and the diversification of AI initiatives. Whether admired or criticized, his contributions have significantly impacted educational institutions such as Oregon State University and Stanford, paving paths for future generations.",
      keywords: [
        "Huang's societal commitment",
        "AI initiative diversification",
        "Oregon State University",
      ],
      cnbcVideos: [
        { awsLink: "aws video", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],

      FootageVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],
      audioPath: {
        index: "4-1729263593900",
        url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-4-1729263593900.mp3",
        duration: 0,
      },
    },
    {
      index: 5,
      text: "Nevertheless, the semiconductor industry faces its share of headwinds. Recent fluctuations in semiconductor stocks—including Nvidia, Broadcom, and Micron Technology—due to geopolitical tensions and labor disputes underscore both caution and opportunity in this vibrant sector. Supply-chain disruptions and investor hesitancy following financial adjustments present challenges. Yet, companies like Nvidia continue to spot and seize opportunities.",
      keywords: [
        "Semiconductor industry headwinds",
        "Nvidia stock fluctuations",
        "Supply-chain disruptions",
      ],
      cnbcVideos: [
        { awsLink: "aws video", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],

      FootageVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],
      audioPath: {
        index: "5-1729263596151",
        url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-5-1729263596151.mp3",
        duration: 0,
      },
    },
    {
      index: 6,
      text: "For those in the business of the AI revolution, chipmakers like Nvidia, Broadcom, and Micron remain lucrative paths for investors seeking growth-oriented returns. Despite the inherent volatility, these tech leaders are regarded by savvy investors as being well-positioned for sustained profitability.",
      keywords: [
        "AI revolution business",
        "Lucrative investment paths",
        "Sustained profitability positioning",
      ],
      cnbcVideos: [
        { awsLink: "aws video", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],

      FootageVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],
      audioPath: {
        index: "6-1729263590422",
        url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-6-1729263590422.mp3",
        duration: 0,
      },
    },
    {
      index: 7,
      text: "As the artificial intelligence adoption waves build with unstoppable energy, Nvidia emerges not just as a tech leader but as a symbol of a promising digital future. While the journey may be fraught with bumps, the rewards for those who remain vigilant and insightful could be tremendous. Nvidia's forward trajectory, driven by the increasing demand for AI solutions, promises substantial long-term growth and value creation.",
      keywords: [
        "Artificial intelligence adoption",
        "Promising digital future",
        "AI solutions demand",
      ],
      cnbcVideos: [
        { awsLink: "aws video", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],

      FootageVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],
      audioPath: {
        index: "7-1729263593818",
        url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-7-1729263593818.mp3",
        duration: 0,
      },
    },
    {
      index: 8,
      text: "As some of the most astute industry analysts have observed, Nvidia's onward march into AI and semiconductors will redefine possibilities and expand the horizons of technological innovation. What is the ultimate resolution? Will Nvidia maintain its formidable stance, leaving detractors bewildered, or do hidden vulnerabilities signal uncharted challenges ahead? Engage with us as we unravel Nvidia's unfolding story and the captivating yet unpredictable landscape of the semiconductor industry.",
      keywords: [
        "Nvidia technological innovation",
        "Uncharted challenges ahead",
        "Semiconductor industry landscape",
      ],
      cnbcVideos: [
        { awsLink: "aws video", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],

      FootageVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],
      audioPath: {
        index: "8-1729263596399",
        url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-8-1729263596399.mp3",
        duration: 0,
      },
    },
    {
      index: 9,
      text: "The road ahead beckons inquiry and exploration—join this conversation, and together, let's chart what lies in store for Nvidia and the transformative semiconductor world.",
      keywords: [
        "Inquiry and exploration",
        "Nvidia future charting",
        "Transformative semiconductor world",
      ],
      cnbcVideos: [
        { awsLink: "aws video", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],

      FootageVideos: [
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
        { awsLink: "", duration: 0 },
      ],
      audioPath: {
        index: "9-1729263589695",
        url: "https://machine-genius.s3.amazonaws.com/My_Audios/audio-9-1729263589695.mp3",
        duration: 0,
      },
    },
  ],
};
