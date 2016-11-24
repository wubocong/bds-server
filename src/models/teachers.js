import mongoose from 'mongoose'

const Teacher = new mongoose.Schema({
  type: { type: String, default: 'Teacher' },
  teacherId: { type: String, required: true, unique: true },
  grade: { type: Number, required: true, default: 2013 },
  major: { type: String, required: true, default: '软件工程' },
  paperId: { type: String, unique: true },
  defenseId: { type: String, unique: true },
  tutor: { type: String },
})

export default mongoose.model('teacher', Teacher)
