import { Schema, model } from "mongoose";

import { hash } from "bcrypt";
import { Schema, model, Types } from "mongoose";
import { platform, type } from "os";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { PlatformArr, PlatformEnum } from "../../Utils/SocialMedia/Platform";
import { EnumStringRequired } from "../../Utils/Schemas";


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


  group_id:  { type:  String, ref: SchemaTypesReference.SocialMediaGroups }
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

export default SocialMediaPosts;
