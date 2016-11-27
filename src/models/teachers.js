import mongoose from 'mongoose'

const Teacher = new mongoose.Schema({
  type: { type: String, default: 'Teacher' },
  teacherId: { type: String, required: true, unique: true },
  studentIds: { type: Array, required: true, default: [] },
  paperIds: { type: Array, required: true, default: [] },
})

export default mongoose.model('teacher', Teacher)
