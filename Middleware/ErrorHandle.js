// Not Found middleware
const NotFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404); // Set status before passing the error
    next(error); // Pass error to the error handler
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    // If status is not set, default it to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Respond with error message and stack trace
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack // Only show stack trace in dev
    });
};

module.exports = { NotFound, errorHandler };
