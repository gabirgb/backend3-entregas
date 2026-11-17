import { UserModel } from '../models/user.model.js';
import { OrderModel } from '../models/order.model.js';
import { logger } from '../config/logger.config.js';
import { CustomError } from '../services/errors/custom-error.js';
import { ERROR_DICTIONARY } from '../constants/error-dictionary.js';

export const uploadUserDocuments = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { documentType } = req.body;
        const file = req.file;

        if (!file) {
            throw CustomError.createError({
                name: 'FileRequiredError',
                message: ERROR_DICTIONARY.FILE_REQUIRED.message,
                code: ERROR_DICTIONARY.FILE_REQUIRED.code,
                status: ERROR_DICTIONARY.FILE_REQUIRED.status
            });
        }

        const user = await UserModel.findById(uid);
        if (!user) {
            throw CustomError.createError({
                name: 'UserNotFoundError',
                message: ERROR_DICTIONARY.USER_NOT_FOUND.message,
                code: ERROR_DICTIONARY.USER_NOT_FOUND.code,
                status: ERROR_DICTIONARY.USER_NOT_FOUND.status
            });
        }

        const metadata = {
            name: file.originalname,
            reference: file.path,
            documentType: documentType || 'identificacion',
            size: file.size,
            mimetype: file.mimetype
        };

        user.documents.push(metadata);
        await user.save();

        logger.info(`Documento subido y asociado al usuario ${uid}`, { path: file.path });

        res.status(200).json({
            status: 'success',
            message: 'Documento subido y asociado correctamente.',
            payload: metadata
        });
    } catch (error) {
        next(error);
    }
};

export const uploadOrderReceipt = async (req, res, next) => {
    try {
        const { oid } = req.params;
        const file = req.file;

        if (!file) {
            throw CustomError.createError({
                name: 'FileRequiredError',
                message: ERROR_DICTIONARY.FILE_REQUIRED.message,
                code: ERROR_DICTIONARY.FILE_REQUIRED.code,
                status: ERROR_DICTIONARY.FILE_REQUIRED.status
            });
        }

        const order = await OrderModel.findById(oid);
        if (!order) {
            throw CustomError.createError({
                name: 'OrderNotFoundError',
                message: 'El pedido especificado no existe en el sistema.',
                code: 'ORDER_NOT_FOUND',
                status: 404
            });
        }

        const metadata = {
            name: file.originalname,
            reference: file.path,
            documentType: 'comprobante_pago',
            size: file.size,
            mimetype: file.mimetype
        };

        order.receipt = metadata;
        await order.save();

        logger.info(`Comprobante asociado al pedido ${oid}`, { path: file.path });

        res.status(200).json({
            status: 'success',
            message: 'Comprobante de pago asociado al pedido con éxito.',
            payload: metadata
        });
    } catch (error) {
        next(error);
    }
};