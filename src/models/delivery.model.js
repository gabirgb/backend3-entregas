import mongoose from 'mongoose';
import { DELIVERY_STATUS } from '../constants/index.js';

const deliverySchema = new mongoose.Schema(
    {
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
        driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Debe tener rol DELIVERY
        status: {
            type: String,
            enum: Object.values(DELIVERY_STATUS),
            default: DELIVERY_STATUS.ASSIGNED,
        },
        estimatedDeliveryTime: { type: Date, required: true },
        trackingCode: { type: String, required: true, unique: true, trim: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const DeliveryModel = mongoose.model('Delivery', deliverySchema);