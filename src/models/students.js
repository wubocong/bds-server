import mongoose from 'mongoose'

const Student = new mongoose.Schema({
  type: { type: String, default: 'Student' },
  studentId: { type: String, required: true, unique: true },
  grade: { type: Number, required: true, default: 2013 },
  major: { type: String, required: true, default: '软件工程' },
  paperId: { type: String },
  defenseId: { type: String },
})

export default mongoose.model('student', Student)
