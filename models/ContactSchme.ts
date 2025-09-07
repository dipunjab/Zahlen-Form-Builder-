import  { Schema, models, model } from 'mongoose'

const SupportRequestSchema = new Schema({
  email: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default models.SupportRequest || model('SupportRequest', SupportRequestSchema)
