import mongoose from 'mongoose'

const Tag = new mongoose.Schema({
  type: { type: String, default: 'Tag' },
  name: { type: String, required: true },
  author: { type: String, required: true },
  time: { type: Number, default: new Date().valueOf() },
})

Tag.pre('save', function (next) {
  const tag = this
  if (!tag.name) {
    throw new Error('Invalid Input')
  }
  next(null)
})

export default mongoose.model('tag', Tag)
