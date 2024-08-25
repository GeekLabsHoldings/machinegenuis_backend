import { Schema, model } from "mongoose";
const movieSchema = new Schema({
  movie:
  {
    required: true,
    type: String,
    default: "uploads/test.mp4"
  }
});

const movieModel = model('Movie', movieSchema);
export default movieModel;