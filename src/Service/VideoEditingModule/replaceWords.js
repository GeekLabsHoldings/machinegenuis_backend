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
}


const addWordAndReplace_srev = new addWordServ();
export { addWordAndReplace_srev };