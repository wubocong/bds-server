import mongoose from 'mongoose'

const Tag = new mongoose.Schema({
  type: { type: String, default: 'Tag' },
  name: { type: String, required: true },
  author: { type: String, required: true },
  time: { type: Number, default: new Date().valueOf() },
})

export default mongoose.model('tag', Tag)
