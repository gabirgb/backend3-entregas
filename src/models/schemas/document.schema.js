import mongoose from 'mongoose';

export const documentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        reference: { type: String, required: true },
        documentType: { type: String, default: 'comprobante' },
        size: { type: Number },
        mimetype: { type: String },
    },
    { timestamps: true }
);