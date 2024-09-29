import { Schema, model } from 'mongoose'

const replacement_wordSchema = new Schema({
  original_word:
  {
    type: String,
    required: true,
  },
  replacement_word:
  {
    type: String,
    required: true,
  }
});
const wordsModel =  model('Word', replacement_wordSchema);
export default wordsModel;