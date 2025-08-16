import mongoose from 'mongoose';

const InternSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  role:      { type: String, default: 'Intern' },
  status:    { type: String, enum: ['Active', 'Paused', 'Completed'], default: 'Active' }
}, { timestamps: true });

InternSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('Intern', InternSchema);
