import { Schema, model, Types } from "mongoose";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { PlatformArr, PlatformEnum } from "../../Utils/SocialMedia/Platform";
import { EnumStringRequired } from "../../Utils/Schemas";
import { socialMediaSchema } from "./SocialMedia.model";

// models/Group.js
const mongoose = require("mongoose");

// Define the schema
const SocialMediaPostsSchema = new mongoose.Schema({
  post_id: {
    type: String,
    required: false,
    trim: true,
  },
  content: {
    type: String,
    required: false,
    trim: true,
  },

  engagment: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },
  
  group_id:  { type:  String}
  ,
  timestamp: {
    type: Number,
    required: true,
    default: 0,
  },

  platform: EnumStringRequired(PlatformArr),
  timestamp: {
    type: Number,
    required: true,
    default: 0,
  },
  brand: {
    type: String,
    required: true,
    trim:true
  },
});













// Create the model
const SocialMediaPosts = mongoose.model(SchemaTypesReference.SocialMediaPosts, SocialMediaPostsSchema);
export const socialMediaModel = SocialMediaPosts.discriminator('twitter_posts', socialMediaSchema);




export default SocialMediaPosts;
