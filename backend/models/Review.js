import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  revieweeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewText: {
    type: String,
    required: true,
    maxlength: 1000,
  },
}, {
  timestamps: true,
});

// One review per user per job
reviewSchema.index({ reviewerId: 1, revieweeId: 1, jobId: 1 }, { unique: true });
reviewSchema.index({ revieweeId: 1 });

export default mongoose.model('Review', reviewSchema);
