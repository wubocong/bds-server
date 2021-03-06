import mongoose from 'mongoose'

const ObjectId = require('mongoose').Schema.Types.ObjectId

const Score = new mongoose.Schema({
  items: {
    topicScore: { type: Number, required: true, default: 0 },
    pointScore: { type: Number, required: true, default: 0 },
    designScore: { type: Number, required: true, default: 0 },
    qualityScore: { type: Number, required: true, default: 0 },
    resultScore: { type: Number, required: true, default: 0 },
    descriptionScore: { type: Number, required: true, default: 0 },
    innovationScore: { type: Number, required: true, default: 0 },
    defenseScore: { type: Number, required: true, default: 0 },
  },
  teacher: {
    _id: { type: ObjectId, ref: 'teacher' },
    name: { type: String },
  },
  sum: { type: Number, required: true, default: 0 },
  isLeader: { type: Boolean, required: true, default: false },
})
const FileInfo = new mongoose.Schema({
  // name: { type: String, unique: true },
  name: { type: String },
  // path: { type: String, unique: true },
  path: { type: String },
  size: { type: Number },
  type: { type: String },
  lastModified: { type: Date, default: Date.now },
})
const Comment = new mongoose.Schema({
  content: { type: String },
  time: { type: Date, default: Date.now },
  id: {type: Number, required: true, default: 0},
})
const Paper = new mongoose.Schema({
  type: { type: String, default: 'Paper' },
  name: { type: String, required: true, unique: true },
  studentId: { type: ObjectId, required: true, ref: 'user' },
  teacherId: { type: ObjectId, required: true, ref: 'user' },
  defenseId: { type: ObjectId, ref: 'defense' },
  desp: { type: String, required: true, default: '你是猪' },
  file: FileInfo,
  scores: [Score],
  comments: [Comment],
  finalScore: { type: Number, default: 0 },
  remark: { type: String, default: '你是猪' },
  lastModified: { type: Date, default: Date.now },
})

export default mongoose.model('paper', Paper)
