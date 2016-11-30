import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId
const Admin = new mongoose.Schema({
  type: { type: String, default: 'Admin' },
  adminId: { type: ObjectId, required: true, unique: true, ref: 'user' },
  defenseIds: [{ type: ObjectId, unique: true, ref: 'defense' }],
})

export default mongoose.model('admin', Admin)
