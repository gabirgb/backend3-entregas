import app from './app.js';
import { config } from './config/env.config.js';
import { connectDB } from './config/db.config.js';
import { logger } from './config/logger.config.js';

const startServer = async () => {
    try {
        await connectDB();

        app.listen(config.port, () => {
            logger.info(`Servidor ShipNow escuchando en el puerto ${config.port}`);
        });
    } catch (error) {
        logger.fatal('Falla crítica al iniciar el servidor HTTP', {
            message: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
};

startServer();