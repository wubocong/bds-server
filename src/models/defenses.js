import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Defense = new mongoose.Schema({
  studentIds: [{ type: ObjectId, unique: true, ref: 'user' }],
  paperIds: [{ type: ObjectId, unique: true, ref: 'paper' }],
  status: { type: Number, required: true, default: 0 },
  remark: { type: String },
  address: { type: String },
  time: { type: Date, default: Date.now },
})

export default mongoose.model('defense', Defense)
