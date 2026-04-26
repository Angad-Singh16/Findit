// authorize(...roles) — role-based access control
// Usage: router.get('/admin', protect, authorize('admin'), handler)
// Usage: router.get('/staff', protect, authorize('admin', 'staff'), handler)

const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is set by protect middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: [${roles.join(', ')}]. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

export default authorize;