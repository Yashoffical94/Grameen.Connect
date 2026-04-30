import { validationResult } from 'express-validator';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Apply to a job
// @route   POST /api/applications
export const applyToJob = async (req, res, next) => {
  try {
    console.log('Application request body:', req.body);
    console.log('Authenticated user:', req.user);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { jobId, coverMessage, expectedRate } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId).populate('contractorId');
    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    // Check if job is active
    if (job.status !== 'active') {
      return next(new AppError('This job is not accepting applications', 400));
    }

    // Check if already applied
    const existing = await Application.findOne({ jobId, workerId: req.user.id });
    if (existing) {
      return next(new AppError('You have already applied to this job', 400));
    }

    // Create application
    const application = await Application.create({
      jobId,
      workerId: req.user.id,
      contractorId: job.contractorId._id,
      coverMessage: coverMessage || '',
      expectedRate: expectedRate || job.dailyRate,
    });

    // Create notification for contractor
    await Notification.create({
      userId: job.contractorId._id,
      type: 'application',
      title: 'New Job Application',
      body: `${req.user.name} has applied for ${job.title}`,
      link: `/jobs/${jobId}`,
    });

    // Update job applicants count
    job.applicantsCount += 1;
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    console.error('Create application error:', error);
    next(error);
  }
};

// @desc    Get labourer's applications
// @route   GET /api/applications/my
export const getMyApplications = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = { workerId: req.user.id };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('jobId', 'title type location dailyRate duration status')
      .populate('contractorId', 'name company location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for contractor's jobs
// @route   GET /api/applications/incoming
export const getIncomingApplications = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = { contractorId: req.user.id };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('jobId', 'title type location dailyRate duration')
      .populate('workerId', 'name trade experience dailyRate rating verified avatarUrl location skills')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id
export const updateApplication = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected', 'withdrawn'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const application = await Application.findById(req.params.id)
      .populate('workerId')
      .populate('jobId');

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    // Check authorization
    if (req.user.role === 'contractor' && application.contractorId.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }
    if (req.user.role === 'labour' && application.workerId._id.toString() !== req.user.id && status !== 'withdrawn') {
      return next(new AppError('Not authorized', 403));
    }

    application.status = status;
    await application.save();

    // Create notification
    const recipientId = req.user.role === 'contractor' ? application.workerId._id : application.contractorId;
    await Notification.create({
      userId: recipientId,
      type: 'application',
      title: `Application ${status === 'accepted' ? 'Accepted' : status === 'rejected' ? 'Rejected' : 'Updated'}`,
      body: `Your application for ${application.jobId.title} has been ${status}`,
      link: `/applications`,
    });

    res.json({
      success: true,
      message: `Application ${status}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    // Check authorization
    if (req.user.role === 'contractor' && application.contractorId.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }
    if (req.user.role === 'labour' && application.workerId.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }

    await application.deleteOne();

    // Update job applicants count
    await Job.findByIdAndUpdate(application.jobId, {
      $inc: { applicantsCount: -1 },
    });

    res.json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
