import { validationResult } from 'express-validator';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Get all jobs with filters
// @route   GET /api/jobs
export const getJobs = async (req, res, next) => {
  try {
    console.log("USER:", req.user);
    const { type, state, trade, minRate, maxRate, sortBy, page = 1, limit = 10 } = req.query;

    const query = { status: 'active' };

    if (type) query.type = type;
    if (state) query['location.state'] = state;
    if (trade) query.trade = trade;
    if (minRate || maxRate) {
      query.dailyRate = {};
      if (minRate) query.dailyRate.$gte = Number(minRate);
      if (maxRate) query.dailyRate.$lte = Number(maxRate);
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'rate') sortOption = { dailyRate: -1 };
    if (sortBy === 'newest') sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(query)
      .populate('contractorId', 'name company location rating verified')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.log("ERROR:", error);
    next(error);
  }
};

// @desc    Get contractor's own jobs
// @route   GET /api/jobs/my
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ contractorId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('contractorId', 'name company location rating verified avatarUrl phone email');

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    // Increment views
    job.views += 1;
    await job.save();

    // Get applicants if user is contractor
    let applicants = [];
    if (req.user && req.user.role === 'contractor' && job.contractorId._id.toString() === req.user.id) {
      applicants = await Application.find({ jobId: job._id })
        .populate('workerId', 'name trade experience dailyRate rating verified avatarUrl location skills');
    }

    res.json({
      success: true,
      data: {
        ...job.toObject(),
        applicants,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job
// @route   POST /api/jobs
export const createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const jobData = {
      ...req.body,
      contractorId: req.user.id,
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    if (job.contractorId.toString() !== req.user.id) {
      return next(new AppError('Not authorized to update this job', 403));
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job status
// @route   PATCH /api/jobs/:id/status
export const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'closed', 'draft'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    if (job.contractorId.toString() !== req.user.id) {
      return next(new AppError('Not authorized to update this job', 403));
    }

    job.status = status;
    await job.save();

    res.json({
      success: true,
      message: `Job marked as ${status}`,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    if (job.contractorId.toString() !== req.user.id) {
      return next(new AppError('Not authorized to delete this job', 403));
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
