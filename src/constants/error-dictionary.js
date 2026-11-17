import { HTTP_STATUS } from './index.js';

export const ERROR_DICTIONARY = Object.freeze({
    // Errores de Usuario
    USER_NOT_FOUND: {
        status: HTTP_STATUS.NOT_FOUND,
        code: 'USER_NOT_FOUND',
        message: 'El usuario solicitado no existe en el sistema.',
    },
    USER_ALREADY_EXISTS: {
        status: HTTP_STATUS.BAD_REQUEST,
        code: 'USER_ALREADY_EXISTS',
        message: 'Ya existe un usuario registrado con ese correo electrónico.',
    },
    INVALID_USER_ROLE: {
        status: HTTP_STATUS.BAD_REQUEST,
        code: 'INVALID_USER_ROLE',
        message: 'El rol de usuario proporcionado no es válido.',
    },

    // Errores de Producto
    PRODUCT_NOT_FOUND: {
        status: HTTP_STATUS.NOT_FOUND,
        code: 'PRODUCT_NOT_FOUND',
        message: 'El producto especificado no fue encontrado.',
    },
    PRODUCT_ALREADY_EXISTS: {
        status: HTTP_STATUS.BAD_REQUEST,
        code: 'PRODUCT_ALREADY_EXISTS',
        message: 'Ya existe un producto registrado con ese código SKU.',
    },

    // Errores de Mocks / Seeding
    INVALID_MOCK_QUANTITY: {
        status: HTTP_STATUS.BAD_REQUEST,
        code: 'INVALID_MOCK_QUANTITY',
        message: 'La cantidad (qty) solicitada es inválida o menor a 1.',
    },
    SEEDING_ERROR: {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        code: 'SEEDING_ERROR',
        message: 'Ocurrió un error crítico durante la inserción masiva de datos en MongoDB.',
    },

    // Errores Generales / Servidor
    INTERNAL_ERROR: {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ocurrió un error interno en el servidor.',
    },

    // Errores de Archivos y Multer
    FILE_REQUIRED: {
        status: HTTP_STATUS.BAD_REQUEST,
        code: 'FILE_REQUIRED',
        message: 'No se ha adjuntado ningún archivo requerido.',
    },
    INVALID_FILE_TYPE: {
        status: HTTP_STATUS.BAD_REQUEST,
        code: 'INVALID_FILE_TYPE',
        message: 'El formato o tipo de archivo no está permitido.',
    },
    FILE_TOO_LARGE: {
        status: HTTP_STATUS.BAD_REQUEST,
        code: 'FILE_TOO_LARGE',
        message: 'El archivo excede el tamaño máximo permitido de 5MB.',
    },
});