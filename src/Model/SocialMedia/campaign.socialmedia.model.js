import { Schema, model, Types } from "mongoose";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { PlatformArr, PlatformEnum } from "../../Utils/SocialMedia/Platform";
import { EnumStringRequired } from "../../Utils/Schemas";


// models/Group.js
const mongoose = require("mongoose");

// Define the schema
const CampaignSchema = new mongoose.Schema({
  content: {
    type: String,
    required: false,
    trim: true,
  },
  
  platform: EnumStringRequired(PlatformArr),

  timestamp: {
    type: Number,
    required: false,
    trim: true,
  },

  engagment: {
    type: Number,
    required: true,
    default: 0,
  },

  posts_shared: {
    type: Number,
    required: true,
    default: 0,
  },
  
  brand: {
    type: Types.ObjectId,
    required: false,
    trim:true
  },

  status: {
    type: String,
    required: false,
    trim: true,
  },
});

// Create the model
const SocialMediaCampaigns = mongoose.model(SchemaTypesReference.Campaigns, CampaignSchema);

export default SocialMediaCampaigns;
