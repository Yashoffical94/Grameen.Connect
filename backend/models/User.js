import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  role: {
    type: String,
    enum: ['labour', 'contractor'],
    required: true,
  },
  location: {
    state: String,
    district: String,
    city: String,
  },
  // Labour-specific fields
  trade: {
    type: String,
    enum: ['Masonry', 'Electrician', 'Plumbing', 'Carpentry', 'Painting', 'Welding', 'Farm Labour', 'Road & Civil'],
  },
  // Contractor-specific fields
  company: String,
  // Common fields
  skills: [String],
  bio: String,
  experience: {
    type: Number,
    min: 0,
    max: 50,
  },
  dailyRate: {
    type: Number,
    min: 0,
  },
  languages: [String],
  available: {
    type: Boolean,
    default: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  avatarUrl: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  totalJobsDone: {
    type: Number,
    default: 0,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Update rating when review is added
userSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ revieweeId: this._id });

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    this.rating = parseFloat((totalRating / reviews.length).toFixed(1));
    this.totalReviews = reviews.length;
  }
};

export default mongoose.model('User', userSchema);
