import { Schema, model } from "mongoose";
import { NotRequiredString, RequiredString } from "../../../Utils/Schemas";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";

const promptsSchema = new Schema({
  service: RequiredString,
  brand: NotRequiredString,
  prompt: RequiredString,
});

const promptsModel = model(SchemaTypesReference.Prompt, promptsSchema);
export default promptsModel;
export { promptsSchema } 