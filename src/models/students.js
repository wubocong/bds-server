import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Student = new mongoose.Schema({
  type: { type: String, default: 'Student' },
  studentId: { type: ObjectId, required: true, unique: true },
  grade: { type: Number, required: true, default: 2013 },
  major: { type: String, required: true, default: '软件工程' },
  clazz: { type: String, required: true, default: 'R5' },
  teacherId: { type: ObjectId },
  paperId: { type: ObjectId },
  defenseId: { type: ObjectId },
})

export default mongoose.model('student', Student)
