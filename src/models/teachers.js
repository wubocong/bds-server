import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Teacher = new mongoose.Schema({
  type: { type: String, default: 'Teacher' },
  posTitle: { type: String, required: true, default: '实验师' },
  proTitle: { type: String, required: true, default: '学士' },
  teacherId: { type: ObjectId, required: true, unique: true },
  studentIds: { type: Array, default: [] },
  paperIds: { type: Array, default: [] },
})

export default mongoose.model('teacher', Teacher)
