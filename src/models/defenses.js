import mongoose from 'mongoose'

const Defense = new mongoose.Schema({
  studentId: { type: String, required: true },
  paperId: { type: String, required: true },
  status: { type: Number, required: true, default: 0 },
  scores: { type: Array },
  remark: { type: String },
  address: { type: String },
  time: { type: Number, default: new Date().getTime() },
})

export default mongoose.model('defense', Defense)
