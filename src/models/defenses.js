import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Defense = new mongoose.Schema({
  studentId: { type: ObjectId, required: true },
  paperId: { type: ObjectId, required: true },
  status: { type: Number, required: true, default: 0 },
  scores: { type: Array },
  remark: { type: String },
  address: { type: String },
  time: { type: Number, default: new Date().getTime() },
})

export default mongoose.model('defense', Defense)
