import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  type: {
    type: String,
    enum: ['Construction', 'Agriculture', 'Skilled Trade', 'Renovation', 'Loading/Shifting','Road', 'Building', 'Civil', 'Other'],
    required: true,
  },
  trade: {
    type: String,
    required: true,
  },
  location: {
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
  },
  workersNeeded: {
    type: Number,
    required: true,
    min: 1,
  },
  dailyRate: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
  requiredSkills: [String],
  accommodation: {
    type: String,
    enum: ['none', 'partial', 'full'],
    default: 'none',
  },
  languagePreference: String,
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active',
  },
  views: {
    type: Number,
    default: 0,
  },
  applicantsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
jobSchema.index({ status: 1, 'location.state': 1, trade: 1 });
jobSchema.index({ contractorId: 1 });

export default mongoose.model('Job', jobSchema);
