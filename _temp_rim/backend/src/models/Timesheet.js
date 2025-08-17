import mongoose from 'mongoose';

const TimesheetSchema = new mongoose.Schema({
  internId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  date:     { type: Date, required: true },
  hours:    { type: Number, required: true, min: 0, max: 24 },
  notes:    String
}, { timestamps: true });

TimesheetSchema.index({ internId: 1, date: 1 }, { unique: true });

export default mongoose.model('Timesheet', TimesheetSchema);
