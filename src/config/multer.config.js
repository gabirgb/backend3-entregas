import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegurar que existan las carpetas base de uploads
const uploadDirs = ['uploads/profiles', 'uploads/documents', 'uploads/receipts'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'profile') {
            cb(null, 'uploads/profiles/');
        } else if (file.fieldname === 'document') {
            cb(null, 'uploads/documents/');
        } else if (file.fieldname === 'receipt') {
            cb(null, 'uploads/receipts/');
        } else {
            cb(null, 'uploads/');
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'profile') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('El archivo de perfil debe ser una imagen válida.'), false);
        }
    } else if (file.fieldname === 'document' || file.fieldname === 'receipt') {
        // Permitir PDF o imágenes para documentos/comprobantes
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('El documento o comprobante debe estar en formato PDF o imagen.'), false);
        }
    } else {
        cb(new Error('Campo de archivo no reconocido.'), false);
    }
};

export const uploader = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
    fileFilter
});