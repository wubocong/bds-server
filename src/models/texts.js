import mongoose from 'mongoose'

const Text = new mongoose.Schema({
  type: { type: String, default: 'Text' },
  content: { type: String, required: true },
  author: { type: String, required: true },
  time: { type: Number, default: new Date().valueOf() },
  tag: { type: String, required: true },
})

export default mongoose.model('text', Text)
