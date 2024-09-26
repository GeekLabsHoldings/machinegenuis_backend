import wordsModel from '../../Model/VideoEditing/replacementWords_model';
import { addWordAndReplace_srev } from '../../Service/VideoEditingModule/replaceWords';
const addWordToReplace = async (req, res) => {
    try {
      const { original_word , replacement_word } = req.body;
      if (!original_word || !replacement_word) {
        return res
          .status(400)
          .json({ success: false, error: "No words provided" });
      }
      const words = await addWordAndReplace_srev.addReplaceWord(original_word , replacement_word);
  
      return res.json({ success: true, words });
    } catch (error) {
      console.error("Error in addWordToReplace:", error);
      return res
        .status(500)
        .json({ success: false, error: "Something went wrong!" });
    }
};

const findToReplace = async (req, res) => {
    try {
      const { selectedContent } = req.body;
      if ( ! selectedContent) {
        return res
          .status(400)
          .json({ success: false, error: "No selectedContent provided" });
      }
      const wordsList = await wordsModel.find({});
      let updatedContent = selectedContent;

      wordsList.forEach(({ original_word, replacement_word }) => {
          const regex = new RegExp(`\\b${original_word}\\b`, 'g');
          updatedContent = updatedContent.replace(regex, replacement_word);
      });

      return res.json({ success: true, updatedContent });
    } catch (error) {
      console.error("Error in addWordToReplace:", error);
      return res
        .status(500)
        .json({ success: false, error: "Something went wrong!" });
    }
};

export { addWordToReplace, findToReplace };