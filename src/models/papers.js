import mongoose from 'mongoose'

const Paper = new mongoose.Schema({
  type: { type: String, default: 'Paper' },
  name: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  teacherId: { type: String, required: true },
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
