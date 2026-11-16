import mongoose from 'mongoose';
import { config } from './env.config.js';
import { logger } from './logger.config.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        logger.info(`Conexión a MongoDB establecida (Entorno: ${config.nodeEnv})`);
    } catch (error) {
        logger.fatal('Error crítico al conectar con MongoDB', {
            message: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
};