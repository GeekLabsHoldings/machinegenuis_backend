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
const TelegramSchema = new mongoose.Schema({
  group_name: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
    required: true,
    trim: true,
  },
  group_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  subscribers: {
    type: Number,
    required: true,
    default: 0,
  },
  niche: {
    type: String,
    required: false,
    trim: true,
  },

  platform: EnumStringRequired(PlatformArr),

  brand: EnumStringRequired(brandArr),

  engagement: {
    type: Number,
    required: false,
    default: 0,
  },
});

// Create the model
const telegramModel = mongoose.model(SchemaTypesReference.Telegram, TelegramSchema);

export default telegramModel;
