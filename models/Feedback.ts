import { Schema, models, model } from "mongoose";

const FeedbackSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true }, 
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Feedback || model("Feedback", FeedbackSchema);
