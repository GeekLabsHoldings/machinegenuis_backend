import { Schema, model, Types } from "mongoose";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import IGroupAnalytics from "./IGroupAnalytics.interface";



const GroupsAnalyticsSchema = new Schema<IGroupAnalytics>({
  brand: {
    type: String,
    required: true,
    trim: true,
  },

  group_id: {
    type: String,
    required: true,
    trim: true,
  },

  timestamp: {
    type: Number,
    required: true,
    unique:false
  },

  platform: {
    type: String,
    required: true,
    unique:false
  },

  subs: {
    type: Number,
    required: true,
    unique:false
  },

});



const GroupsAnalyticsModel = model<IGroupAnalytics>(SchemaTypesReference.GroupsAnalytics, GroupsAnalyticsSchema);
export default GroupsAnalyticsModel
