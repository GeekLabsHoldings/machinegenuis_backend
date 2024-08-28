import { Schema, model } from "mongoose";

const scrapedSchema = new Schema({
  title:
  {
    type: String,
    unique: false,
    required: true,
  },
  content:
  {
    type: String,
    required: false
  },
  date:
  {
    type: String,
    required: false
  },
  brand:
  {
    type: String,
    required: true
  },
  stock:
  {
    type: String,
    required: false
  }
});

const scrapedModel = model('Scraped', scrapedSchema);
export default scrapedModel;
export { scrapedSchema }