import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Teacher = new mongoose.Schema({
  type: { type: String, default: 'Teacher' },
  teacherId: { type: ObjectId, required: true, unique: true },
  studentIds: { type: Array, default: [] },
  paperIds: { type: Array, default: [] },
})

export default mongoose.model('teacher', Teacher)
