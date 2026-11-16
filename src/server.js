import app from './app.js';
import { config } from './config/env.config.js';
import { connectDB } from './config/db.config.js';

const startServer = async () => {
    try {
        // 1. Conectar a la base de datos primero
        await connectDB();

        // 2. Arrancar el servidor HTTP una vez establecida la conexión
        app.listen(config.port, () => {
            console.log(`Servidor ShipNow escuchando en el puerto ${config.port} (${config.nodeEnv})`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

startServer();