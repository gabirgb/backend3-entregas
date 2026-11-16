import { HTTP_STATUS } from '../constants/index.js';
import { logger } from '../config/logger.config.js';

export const handleErrors = (err, req, res, next) => {
    let error = err;

    // 1. Manejo y normalización de errores de Mongoose
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message).join(', ');
        error.statusCode = 400;
        error.code = 'VALIDATION_ERROR';
        error.message = `Error de validación: ${messages}`;
    } else if (error.name === 'CastError') {
        error.statusCode = 400;
        error.code = 'INVALID_ID';
        error.message = `El formato del ID proporcionado es inválido: ${error.value}`;
    } else if (error.code === 11000) {
        // Error de duplicidad en MongoDB (índice único, ej. email ya registrado)
        error.statusCode = 400;
        error.code = 'DUPLICATE_KEY_ERROR';
        error.message = 'El registro ya existe en la base de datos.';
    }

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