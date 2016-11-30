import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Teacher = new mongoose.Schema({
  type: { type: String, default: 'Teacher' },
  posTitle: { type: String, required: true, default: '' },
  proTitle: { type: String, required: true, default: '' },
  teacherId: { type: ObjectId, required: true, unique: true },
  studentIds: [{ type: ObjectId, unique: true, ref: 'user' }],
  paperIds: [{ type: ObjectId, unique: true, ref: 'paper' }],
})

export default mongoose.model('teacher', Teacher)
