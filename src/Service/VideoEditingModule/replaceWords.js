import wordsModel from "../../Model/VideoEditing/replacementWords_model";

class addWordServ  {
    async addReplaceWord(original_word, replacement_word) {
        try {
            const new_word = new wordsModel({
                original_word,
                replacement_word,
            });
            await new_word.save();                
        
            return { new_word };
        } catch (error) {
            console.error(`Error saving to database: ${error}`);
            throw new Error(`Database save failed: ${error.message}`);
        }
    }

    async findAndReplaceWords(content, wordsList){
        let updatedContent = content;
        console.log(updatedContent);
              
        wordsList.forEach(({ original_word, replacement_word }) => {
          const regex = new RegExp(`\\b${original_word}\\b`, 'g');
          updatedContent = updatedContent.replace(regex, replacement_word);
        });
        console.log(updatedContent);
        return updatedContent;
    };   
}


const addWordAndReplace_srev = new addWordServ();
export { addWordAndReplace_srev };