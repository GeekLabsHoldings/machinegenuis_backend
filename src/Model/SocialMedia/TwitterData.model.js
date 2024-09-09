import { Schema, model } from "mongoose";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
const TwitterDataSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  token: { type: String, required: true },
});

const twitterModel = model( SchemaTypesReference.TwitterData,TwitterDataSchema);

export default twitterModel;