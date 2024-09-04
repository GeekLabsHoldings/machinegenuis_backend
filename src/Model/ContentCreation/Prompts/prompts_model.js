import { Schema, model } from "mongoose";

const promptsSchema = new Schema({
  brand:
  {
    type: String,
    required: true
  },
  article_prompt:
  {
    type: String,
    required: false
  },
  script_prompt:
  {
    type: String,
    required: true
  },
  title_prompt:
  {
    type: String,
    required: true
  },
  thumnail_prompt:
  {
    type: String,
    required: false
  },
});

const promptsModel = model('Prompts', promptsSchema);
export default promptsModel;
export { promptsSchema }