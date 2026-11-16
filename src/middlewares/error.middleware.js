import { HTTP_STATUS } from '../constants/index.js';
import { logger } from '../config/logger.config.js';

export const handleErrors = (err, req, res, next) => {
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

    if (err.isFatal) {
        logger.fatal(`${err.name || 'FatalError'}: ${err.message}`, {
            cause: err.cause,
            stack: err.stack,
            path: req.originalUrl,
        });
    } else if (statusCode >= 500) {
        logger.error(`${err.name || 'ServerError'}: ${err.message}`, {
            cause: err.cause,
            stack: err.stack,
            path: req.originalUrl,
        });
    } else {
        // Errores operacionales / de negocio (400, 404, etc.)
        logger.warning(`${err.name || 'OperationalError'}: ${err.message}`, {
            code: errorCode,
            cause: err.cause,
            path: req.originalUrl,
        });
    }

    res.status(statusCode).json({
        status: 'error',
        code: errorCode,
        message: err.message || 'Error interno del servidor',
        ...(err.cause && { cause: err.cause }),
    });
};