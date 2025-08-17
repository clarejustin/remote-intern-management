import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  description: String,
  internId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  status:    { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  dueDate:   Date
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);
