import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, minlength: 2, maxlength: 60 },
  email: { type: String, trim: true, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'manager', 'viewer'], default: 'manager' }
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('User', UserSchema);
