import { Schema, model, Types } from "mongoose";
import { platform, type } from "os";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import { Certificate } from "crypto";
import IDomain from "./IDomain.interface";



const domainSchema = new Schema<IDomain>({
  domainName: {
    type: String,
    required: true,
    trim: true,
    unique:true
  },

  contactEmail: {
    type: String,
    required: true,
    trim: true,
  },

  registerDate: {
    type: Number,
    default: Date.now(),
    required: false,
    unique:false
  },

  brand :{type:Types.ObjectId, ref:SchemaTypesReference.Brands},

  autoRenew : {type:Boolean, required:false},
  certificateID : {type:String, required:false},
  hostedZoneID : {type:String, required:false},

});





const domainModel = model<IDomain>(SchemaTypesReference.domains, domainSchema);

export default domainModel;