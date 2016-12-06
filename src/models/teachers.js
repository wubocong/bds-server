import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Teacher = new mongoose.Schema({
  type: { type: String, default: 'Teacher' },
  teacherId: { type: ObjectId, required: true, unique: true },
  studentIds: [{ type: ObjectId, unique: true, ref: 'user' }],
  defenseIds: [{ type: ObjectId, unique: true, ref: 'user' }],
  paperIds: [{ type: ObjectId, unique: true, ref: 'paper' }],
  posTitle: { type: String, default: '无' },
  proTitle: { type: String, default: '' },
})

export default mongoose.model('teacher', Teacher)
