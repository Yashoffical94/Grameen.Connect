import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending',
  },
  coverMessage: String,
  expectedRate: Number,
}, {
  timestamps: true,
});

// Ensure one application per worker per job
applicationSchema.index({ jobId: 1, workerId: 1 }, { unique: true });
applicationSchema.index({ workerId: 1 });
applicationSchema.index({ contractorId: 1 });

export default mongoose.model('Application', applicationSchema);
