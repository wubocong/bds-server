import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Admin = new mongoose.Schema({
  type: { type: String, default: 'Admin' },
  adminId: { type: ObjectId, required: true, unique: true },
  defenseIds: { type: Array, required: true, default: [] },
})

export default mongoose.model('admin', Admin)
