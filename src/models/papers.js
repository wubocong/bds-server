import mongoose from 'mongoose'

const Paper = new mongoose.Schema({
  type: { type: String, default: 'Paper' },
  name: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  teacherId: { type: String, required: true },
  filePath: { type: String },
  fileSize: { type: Number },
  desp: { type: String },
  comments: { type: Array },
  lastModifiedDate: { type: Number, default: new Date().getTime() },
})

export default mongoose.model('paper', Paper)
