import { Schema, model } from "mongoose";
import { scrapedSchema } from "../Scraped/scraped_model"
import { RequiredNumber, RequiredString } from "../../../Utils/Schemas";


const GeneratedContentSchema = new Schema({
    generalTitle: RequiredString,
    articleJson: [scrapedSchema],
    brand: RequiredString,
    stock: RequiredString,
    createdAt: RequiredNumber
})


const generatedContentModel = model('generated-content', GeneratedContentSchema);

export default generatedContentModel;