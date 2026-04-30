import { AppError } from './errorHandler.js';

/**
 * Middleware to check if user has required role(s)
 * Usage: authorize('contractor') or authorize('labour', 'contractor')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Please login to access this resource', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(
        `Access denied. This feature is only available for: ${roles.join(', ')}`,
        403
      ));
    }

    next();
  };
};

/**
 * Specific role checkers for common use cases
 */
export const isLabour = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Please login', 401));
  }
  if (req.user.role !== 'labour') {
    return next(new AppError('This feature is only available for workers', 403));
  }
  next();
};

export const isContractor = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Please login', 401));
  }
  if (req.user.role !== 'contractor') {
    return next(new AppError('This feature is only available for contractors', 403));
  }
  next();
};
