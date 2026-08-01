export function notFoundHandler(req, res) {
    res.status(404).json({
        message: `Route ${req.method} ${req.originalUrl || req.url} not found`,
    });
}

export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    if (process.env.NODE_ENV !== 'production') {
        console.error('❌ Error:', err);
    }

    // Handle JSON syntax errors from body-parser
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON payload in request body',
        });
    }

    // Handle Zod schema validation errors
    if (err.name === 'ZodError') {
        const issues = err.issues || err.errors || [];
        return res.status(422).json({
            message: 'Validation failed',
            errors: issues.map((e) => ({
                field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
                message: e.message,
            })),
        });
    }

    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
        const keyPattern = err.keyPattern || {};
        const keyValue = err.keyValue || {};
        const field = Object.keys(keyPattern)[0] || Object.keys(keyValue)[0] || 'Field';
        return res.status(409).json({
            message: `${field} already exists`,
        });
    }

    // Handle Mongoose schema validation errors
    if (err.name === 'ValidationError' && err.errors) {
        return res.status(422).json({
            message: 'Validation failed',
            errors: Object.values(err.errors).map((e) => ({
                field: e.path,
                message: e.message,
            })),
        });
    }

    // Handle Mongoose invalid ObjectId errors
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: `Invalid format for parameter: ${err.path || 'id'}`,
        });
    }

    // Handle JWT token validation errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid authorization token',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Authorization token has expired',
        });
    }

    // Handle HTTP errors with statusCode or status
    const statusCode = err.statusCode || err.status;
    if (statusCode && statusCode >= 400 && statusCode < 600) {
        return res.status(statusCode).json({
            message: err.message || 'An error occurred',
        });
    }

    // Handle unhandled / 500 server errors
    console.error('❌ Unhandled error:', err);
    const isProduction = process.env.NODE_ENV === 'production';
    return res.status(500).json({
        message: isProduction
            ? 'Something went wrong. Please try again later.'
            : err.message || 'Something went wrong. Please try again later.',
    });
}