import { Schema, model } from 'mongoose'
import contentTypes from '../../../Utils/Utilities/content_types' 
import approvalTypes from '../../../Utils/Utilities/approval_types' 
const contentSchema = new Schema({
  user_id:
  {
    type: String,
    unique: false,
    required: true,
  },
  user_name:
  {
    type: String,
    unique: false,
    required: true,
  },
  content_title:
  {
    type: String,
    unique: true,
    required: true
  },
  content:
  {
    type: String,
    required: true
  },
  brand:
  {
    type: String,
    required: true,
  },
  content_type:
  {
    type: String, // ["SCRIPT", "ARTICLE"]
    enum: [contentTypes.ARTICLE, contentTypes.SCRIPT],
    default: contentTypes.SCRIPT,
  },
  views:
  {
    type: Number,
    required: false
  },
  date:
  {
    type: Date,
    required: false
  },
  approvals:
  {
    type: String,
    required: false,
    enum: [approvalTypes.PENDING, approvalTypes.REJECTED, approvalTypes.ACCEPTED],
    default: approvalTypes.PENDING,
  },
  movie:
  {
    required: false,
    type: String,
  },
  SEO:
  {
    required: false,
    type: Object,
  }
});
const contentModel =  model('Content', contentSchema);
export default contentModel;