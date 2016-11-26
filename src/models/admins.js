import mongoose from 'mongoose'

const Admin = new mongoose.Schema({
  type: { type: String, default: 'Admin' },
  adminId: { type: String, required: true, unique: true },
  defenseIds: { type: Array, required: true, default: [] },
})

export default mongoose.model('admin', Admin)
