import { Router } from 'express';
import { logger } from '../config/logger.config.js';
import { HTTP_STATUS } from '../constants/index.js';

const router = Router();

router.get('/loggerTest', (req, res) => {
    logger.debug('Prueba de nivel DEBUG: detalle técnico de flujo interno');
    logger.http('Prueba de nivel HTTP: registro de petición entrante');
    logger.info('Prueba de nivel INFO: operación estándar completada');
    logger.warning('Prueba de nivel WARNING: advertencia o regla de negocio no cumplida');
    logger.error('Prueba de nivel ERROR: fallo inesperado controlado');
    logger.fatal('Prueba de nivel FATAL: falla crítica del sistema');

    res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Logs de prueba generados en todos los niveles. Revisa la consola y la carpeta /logs.',
    });
});

export default router;