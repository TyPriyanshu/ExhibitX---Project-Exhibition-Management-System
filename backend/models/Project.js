
import mongoose from 'mongoose';

const scoreSub = new mongoose.Schema({
  judgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  judgeName: { type: String },
  score: { type: Number, min: 0, max: 10 },
  feedback: { type: String }
},{ _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tools: [{ type: String }],
  imageUrl: { type: String },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String },
  ticketNo: { type: String, required: true, unique: true },
  qrDataUrl: { type: String, required: true },
  exhibitionDate: { type: String, required: true },
  projectType: { type: String, enum: ['Web','ML','Data Science','IoT','Other'], required: true },
  customType: { type: String },
  teamMembers: [{ type: String }],
  scores: [scoreSub],
  avgScore: { type: Number, default: 0 },
  scoresCount: { type: Number, default: 0 },
  githubUrl: { type: String, required: true}
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
