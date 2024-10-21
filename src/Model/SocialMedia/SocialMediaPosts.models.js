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

  
  group_id:  { type:  String, unique: false, required:false, default:0}
  ,

  timestamp: {
    type: Number,
    required: false,
    default: Date.now(),
  },

  platform: EnumStringRequired(PlatformArr),

  
  brand: {
    type: String,
    required: false,
    trim:true
  },

  
  likes: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },
  
  comments: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },
  
  shares: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },

  postId: {
    type: String,
    required: false,
  },
});
// Create the model
const SocialMediaPosts = mongoose.model(SchemaTypesReference.SocialMediaPosts, SocialMediaPostsSchema);
export const socialMediaModel = SocialMediaPosts.discriminator('twitter_posts', socialMediaSchema);
export default SocialMediaPosts;
