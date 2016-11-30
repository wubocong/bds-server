import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Defense = new mongoose.Schema({
  name: {type: String, unique: true, required: true},
  address: { type: String, required: true },
  time: { type: Date, required: true },
  status: { type: Number, required: true, default: 0 },
  studentIds: [{ type: ObjectId, unique: true, ref: 'user' }],
  teacherIds: [{ type: ObjectId, unique: true, ref: 'user' }],
  adminIds: [{ type: ObjectId, unique: true, ref: 'user' }],
  paperIds: [{ type: ObjectId, unique: true, ref: 'paper' }],
})

export default mongoose.model('defense', Defense)
