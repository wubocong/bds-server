import mongoose from 'mongoose'

const Defense = new mongoose.Schema({
  studentId: { type: String, required: true },
  paper: { type: String, required: true },
  scores: { type: Array },
  remark: { type: String },
  time: { type: Number, default: new Date().getTime() },
})

export default mongoose.model('defense', Defense)
