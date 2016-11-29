import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Paper = new mongoose.Schema({
  type: { type: String, default: 'Paper' },
  name: { type: String, required: true, unique: true },
  studentId: { type: ObjectId, required: true },
  teacherId: { type: ObjectId, required: true },
  fileName: { type: String },
  filePath: { type: String },
  fileSize: { type: Number },
  fileType: { type: String },
  fileLastModified: { type: Number },
  desp: { type: String },
  comments: { type: Array },
  lastModified: { type: Number, default: new Date().getTime() },
})

export default mongoose.model('paper', Paper)
