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
const TelegramMSchema = new mongoose.Schema({
  message_id: {
    type: String,
    required: true,
    trim: true,
  },
  text: {type: String, required: true},

  channel_id:  { type: Schema.Types.ObjectId, ref: SchemaTypesReference.TelegramMessage }
  ,
  timestamp: {
    type: Number,
    required: true,
    default: 0,
  },

});

// Create the model
const TelegramMessage = mongoose.model(SchemaTypesReference.TelegramMessage, TelegramSchema);

export default TelegramMessage;
