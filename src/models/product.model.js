import mongoose from 'mongoose';
import { PRODUCT_STATUS } from '../constants/index.js';

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        code: { type: String, required: true, unique: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0, default: 0 },
        category: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: Object.values(PRODUCT_STATUS),
            default: PRODUCT_STATUS.AVAILABLE,
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const ProductModel = mongoose.model('Product', productSchema);