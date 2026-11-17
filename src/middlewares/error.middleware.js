import { HTTP_STATUS } from '../constants/index.js';
import { logger } from '../config/logger.config.js';
import multer from 'multer'; // <--- Importante para reconocer errores de Multer

export const handleErrors = (err, req, res, next) => {
    let error = err;

    // 1. Manejo y normalización de errores de Multer (Módulo 7)
    if (error instanceof multer.MulterError) {
        error.statusCode = 400;
        if (error.code === 'LIMIT_FILE_SIZE') {
            error.code = 'FILE_TOO_LARGE';
            error.message = 'El archivo excede el tamaño máximo permitido de 5MB.';
        } else {
            error.code = 'MULTER_ERROR';
            error.message = `Error en la carga de archivo: ${error.message}`;
        }
    }
    // 2. Manejo y normalización de errores de Mongoose
    else if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message).join(', ');
        error.statusCode = 400;
        error.code = 'VALIDATION_ERROR';
        error.message = `Error de validación: ${messages}`;
    } else if (error.name === 'CastError') {
        error.statusCode = 400;
        error.code = 'INVALID_ID';
        error.message = `El formato del ID proporcionado es inválido: ${error.value}`;
    } else if (error.code === 11000) {
        error.statusCode = 400;
        error.code = 'DUPLICATE_KEY_ERROR';
        error.message = 'El registro ya existe en la base de datos.';
    }

    const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const errorCode = error.code || 'INTERNAL_SERVER_ERROR';

    if (error.isFatal) {
        logger.fatal(`${error.name || 'FatalError'}: ${error.message}`, {
            cause: error.cause,
            stack: error.stack,
            path: req.originalUrl,
        });
    } else if (statusCode >= 500) {
        logger.error(`${error.name || 'ServerError'}: ${error.message}`, {
            cause: error.cause,
            stack: error.stack,
            path: req.originalUrl,
        });
    } else {
        // Errores operacionales / de negocio (400, 404, etc.)
        logger.warning(`${error.name || 'OperationalError'}: ${error.message}`, {
            code: errorCode,
            cause: error.cause,
            path: req.originalUrl,
        });
    }

    res.status(statusCode).json({
        status: 'error',
        code: errorCode,
        message: error.message || 'Error interno del servidor',
        ...(error.cause && { cause: error.cause }),
    });
};