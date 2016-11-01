import mongoose from 'mongoose'

const File = new mongoose.Schema({
  type: { type: String, default: 'application/octet-stream' },
  name: { type: String, required: true },
  author: { type: String, required: true },
  path: { type: String, required: true },
  tag: { type: String, required: true },
  size: { type: Number, required: true },
  time: { type: Number, default: new Date().getTime() },
  lastModifiedDate: { type: Number, default: new Date().getTime() },
})

File.pre('save', function (next) {
  // const file = this
  next(null)
})

export default mongoose.model('file', File)
