import { Schema, model } from "mongoose";

const scrapedSchema = new Schema({
  url: {
    type: String,
    unique: false,
    required: false,
  },
  title: {
    type: String,
    unique: false,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  time: {
    type: Number,
    required: false,
  },
  brand: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: false,
  },
});

const scrapedModel = model("Scraped", scrapedSchema);
export default scrapedModel;
export { scrapedSchema };
