import expressRateLimit from 'express-rate-limit';

const registerRateLimiter = expressRateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after a minute.',
    },
    statusCode: 429,
});


export default registerRateLimiter;