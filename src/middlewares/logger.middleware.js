import { logger } from '../config/logger.config.js';

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} ${req.url} - IP: ${req.ip}`);
    next();
};