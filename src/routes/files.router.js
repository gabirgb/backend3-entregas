import { Router } from 'express';
import { uploader } from '../config/multer.config.js';
import { uploadUserDocuments, uploadOrderReceipt } from '../controllers/files.controller.js';
import { CustomError } from '../services/errors/custom-error.js';
import { ERROR_DICTIONARY } from '../constants/error-dictionary.js';
import multer from 'multer';

const router = Router();

const handleMulterUpload = (fieldName, maxCount = 1) => {
    const uploadMiddleware = maxCount === 1 ? uploader.single(fieldName) : uploader.array(fieldName, maxCount);

    return (req, res, next) => {
        uploadMiddleware(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return next(CustomError.createError({
                        name: 'FileTooLargeError',
                        message: 'El archivo excede el límite de 5MB.',
                        code: 'FILE_TOO_LARGE',
                        status: 400
                    }));
                }
                return next(err);
            } else if (err) {
                return next(err);
            }

            // Validar aquí mismo si falta el archivo requerido
            if (!req.file && (!req.files || req.files.length === 0)) {
                return next(CustomError.createError({
                    name: 'FileRequiredError',
                    message: ERROR_DICTIONARY.FILE_REQUIRED.message,
                    code: ERROR_DICTIONARY.FILE_REQUIRED.code,
                    status: ERROR_DICTIONARY.FILE_REQUIRED.status // Esto disparará el 400 exacto que espera tu test
                }));
            }

            next();
        });
    };
};


// ruta resultante: POST /api/users/:uid/documents
router.post('/users/:uid/documents', handleMulterUpload('document', 1), uploadUserDocuments);

// ruta resultante:  POST /api/orders/:oid/receipt (o deliveries según prefiera)
router.post('/orders/:oid/receipt', handleMulterUpload('receipt', 1), uploadOrderReceipt);

export default router;