import { HTTP_STATUS } from '../constants/index.js';

export const handleErrors = (err, req, res, next) => {
    console.error(`[ERROR CAPTURADO]: ${err.message}`, {
        cause: err.cause || 'Sin causa especificada',
        stack: err.stack,
    });

    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

    res.status(statusCode).json({
        status: 'error',
        code: errorCode,
        message: err.message || 'Error interno del servidor',
        ...(err.cause && { cause: err.cause }),
    });
};