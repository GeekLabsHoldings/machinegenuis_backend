import { Schema, model } from "mongoose";
import { scrapedSchema } from "../Scraped/scraped_model"
import { RequiredNumber } from "../../../Utils/Schemas";
const organizedArticles = new Schema({
    generalTitle: {
        type: String,
        required: true,
    },
    articleJson: [scrapedSchema]
})

const GeneratedContentSchema = new Schema({
    organizedArticles: [organizedArticles],
    brand: { type: String, required: true },
    stock: { type: String, required: true },
    createdAt: RequiredNumber
})


const generatedContentModel = model('generated-content', GeneratedContentSchema);

export default generatedContentModel;