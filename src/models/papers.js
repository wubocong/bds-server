import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Paper = new mongoose.Schema({
  type: { type: String, default: 'Paper' },
  name: { type: String, required: true, unique: true },
  studentId: { type: ObjectId, required: true, ref: 'user' },
  teacherId: { type: ObjectId, required: true, ref: 'user' },
  file: {
    name: { type: String },
    path: { type: String },
    size: { type: Number },
    type: { type: String },
    lastModified: { type: Date, default: Date.now },
  },
  scores: {
    teacherId: { type: ObjectId, ref: 'teacher' },
    items: [{ type: Number }],
    sum: { type: Number },
    remark: { type: String },
  },
  desp: { type: String },
  comments: [{ content: { type: String }, time: { type: Date, default: Date.now } }],
  lastModified: { type: Date, default: Date.now },
})

export default mongoose.model('paper', Paper)
