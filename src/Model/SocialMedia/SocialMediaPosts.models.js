import { Schema, model } from "mongoose";

import { hash } from "bcrypt";
import { Schema, model, Types } from "mongoose";
import { platform, type } from "os";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { EnumStringRequired } from "../../Utils/Schemas";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";
import { brandArr } from "../../Utils/SocialMedia/Brand";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
// models/Group.js
const mongoose = require("mongoose");

// Define the schema
const SocialMediaPostsSchema = new mongoose.Schema({
  post_id: {
    type: String,
    required: false,
    trim: true,
  },

  group_name: {type: String, required: false},

  group_id:  { type:  String, ref: SchemaTypesReference.SocialMediaGroups }
  ,
  timestamp: {
    type: Number,
    required: true,
    default: 0,
  },

});

// Create the model
const SocialMediaPosts = mongoose.model(SchemaTypesReference.SocialMediaPosts, SocialMediaPostsSchema);

export default SocialMediaPosts;
