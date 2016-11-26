import mongoose from 'mongoose'

const Paper = new mongoose.Schema({
  type: { type: String, default: 'application/octet-stream' },
  name: { type: String, required: true },
  studentId: { type: String, required: true },
  teacherId: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  lastModifiedDate: { type: Number, default: new Date().getTime() },
})

export default mongoose.model('paper', Paper)
