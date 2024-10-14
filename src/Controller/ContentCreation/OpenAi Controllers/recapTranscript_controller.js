const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const convertText = require('../../../Service/VideoEditingModule/splitContent')

const recapContent = async (myContent) => {
  try {
    const prompt = `rewrite this as movie recape :-${myContent} `;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message.content.trim();
    // const [title, ...newContent] = result.split('\n');
    return {
      // title: title.replace("Title: ", "").trim(),
      content: result,
    };
  } catch (error) {
    console.error("Error generating recap:", error);
    throw error;
  }
};

// const recapAllContent = async (myContent, timeStamp) => {
//   try {
//     const prompt = `
//       Write me a movie recap for this transcript use storytelling format and write it in third person point of view,
//       Write it in a suspenseful tone, apply emotions when applicable. with specific timestamps:
//       ${myContent}
      
//       Here are the timestamps:
//       ${timeStamp}
      
//       Format the output in HTML structure like this:
//       <h4>Time stamps</h4>
//       <p>[Recapped content]</p>
//       <h4>Time stamps</h4>
//       <p>[Recapped content]</p>
//       <h4>Time stamps</h4>
//       <p>[Recapped content]</p>
//     `;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [{ role: "user", content: prompt }]
//     });

//     const result = completion.choices[0].message.content.trim();
//     return result;
//   } catch (error) {
//     console.error("Error generating recap:", error);
//     throw error;
//   }
// };


// const generateRecapContent = async (req, res) => {
//   try {
//     const { selectedContent } = req.body;

//     if (!selectedContent) {
//       return res
//         .status(400)
//         .json({ success: false, error: "No content provided" });
//     }

//     const finalRecap = [];
//     for (const item of selectedContent) {
//       const { transcription, "time duration": timeDuration } = item;

//       const recappedContent = await recapAllContent(
//         transcription.content, 
//         timeDuration
//       );

//       finalRecap.push({
//         timeDuration: timeDuration,
//         recappedContent: recappedContent
//       });
//     }

//     const formattedResult = finalRecap
//       .map(({ timeDuration, recappedContent }) => {
//         return `<h4>${timeDuration}</h4><p>${recappedContent}</p>`;
//       })
//       .join("\n");

//     res.json({
//       success: true,
//       recap: formattedResult
//     });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

const recapAllContent = async (selectedContent) => {
    try {
      const recapedContent = [];
  
      for (const contentPart of selectedContent) {
        const { "time duration": time, transcription: { content } } = contentPart;
  
        const prompt = `  Write me a movie recap for this transcript use storytelling format and write it in third person point of view,
        Write it in a suspenseful tone, apply emotions when applicable .\n\n${content}`;
  
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }, { role: "user", content: prompt }
          ],
        });
  
        const recap = completion.choices[0].message.content.trim();
        const audioUrl = await convertText.convertTextToAudio(recap , "Recap" )
        recapedContent.push({
          recape: recap,
          time: time,
          audioUrl: audioUrl
        });
      }
  
      return recapedContent;
    } catch (error) {
      console.error("Error generating recap:", error);
      throw error;
    }
  };
  
  const generateRecapContent = async (req, res) => {
    try {
      const { selectedContent, brandName } = req.body;
  
      if (!selectedContent || !brandName) {
        return res
          .status(400)
          .json({ success: false, error: "No content or brand name provided" });
      }
  
      const recaps = await recapAllContent(selectedContent);
  
      res.json({ success: true, recaps: recaps });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  

export { recapContent, recapAllContent ,generateRecapContent };
