import { Schema, model } from "mongoose";
import { scrapedSchema } from "../Scraped/scraped_model"
import { NotRequiredString, RequiredNumber, RequiredString } from "../../../Utils/Schemas";


const GeneratedContentSchema = new Schema({
    generalTitle: RequiredString,
    articleJson: [scrapedSchema],
    brand: RequiredString,
    stock: NotRequiredString,
    createdAt: RequiredNumber
})


const generatedContentModel = model('generated-content', GeneratedContentSchema);

export default generatedContentModel;