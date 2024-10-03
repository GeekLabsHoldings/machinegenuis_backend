
import { hash } from "bcrypt";
import { Schema, model, Types } from "mongoose";
import { platform, type } from "os";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { EnumStringRequired } from "../../Utils/Schemas";
import { nicheListArr } from "../../Utils/SocialMedia/niche";
import { IBrand, ISubBrand } from "./IBrand_interface";


// Define the schema
const options = { discriminatorKey: 'type' };

const BrandSchema = new Schema<IBrand>({
  brand_name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  aquisition_date: {
    type: Date,
    required: true,
    unique:false
  },

  niche:  EnumStringRequired(nicheListArr),

}, options);



const SubBrandSchema = new Schema<ISubBrand>({
  parentId: {
    type: Types.ObjectId,
    ref: SchemaTypesReference.Brands,
    required: true
  },
});


const BrandsModel = model<IBrand>(SchemaTypesReference.Brands, BrandSchema);
// Create the SubBrand model as a discriminator of Brand
const SubBrand = BrandsModel.discriminator<ISubBrand>('subbrand', SubBrandSchema);




export default BrandsModel;