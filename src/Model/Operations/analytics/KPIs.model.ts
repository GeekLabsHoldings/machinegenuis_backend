import { Schema, model, Types } from "mongoose";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import IGroupAnalytics from "./IGroupAnalytics.interface";
import IKPIs from "./IKPIs.intreface";



const KPISchema = new Schema<IKPIs>({
  brand: {
    type: String,
    required: true,
    trim: true,
  },

  platform: {
    type: String,
    required: true,
    unique:false
  },

  timeStamp: {
    type: Number,
    required: false,
    default:Date.now(),
    unique:false
  },

  postsPerDay: {type:Number, default:0},
  postsPerWeek: {type:Number, default:0},
  postsPerMonth: {type:Number, default:0}

});



const KPIAnalyticsModel = model<IKPIs>(SchemaTypesReference.KPI, KPISchema);
export default KPIAnalyticsModel
