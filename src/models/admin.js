import mongoose from 'mongoose'

const Admin = new mongoose.Schema({
  type: { type: String, default: 'Admin' },
  adminId: { type: String, required: true, unique: true },
  grade: { type: Number, required: true, default: 2013 },
  major: { type: String, required: true, default: '软件工程' },
  paperId: { type: String, unique: true },
  defenseId: { type: String, unique: true },
  tutor: { type: String },
})

export default mongoose.model('admin', Admin)
