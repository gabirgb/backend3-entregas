import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.config.js';
import productsRouter from './routes/products.router.js';
import usersRouter from './routes/users.router.js';
import mocksRouter from './routes/mocks.router.js';
import loggerRouter from './routes/logger.router.js';
import { addLogger } from './middlewares/logger.middleware.js';
import { handleErrors } from './middlewares/error.middleware.js';
import { CustomError } from './services/errors/custom-error.js';
import { HTTP_STATUS } from './constants/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging HTTP
app.use(addLogger);

// Ruta interactiva de Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas de negocio y herramientas
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/mocks', mocksRouter);
app.use('/', loggerRouter); // Expone GET /loggerTest

// Captura de rutas inexistentes (404) hacia el middleware global
app.use((req, res, next) => {
    next(
        CustomError.createError({
            name: 'RouteNotFoundError',
            cause: `La ruta ${req.method} ${req.originalUrl} no existe en ShipNow API`,
            message: 'Ruta no encontrada',
            code: 'ROUTE_NOT_FOUND',
            status: HTTP_STATUS.NOT_FOUND,
        })
    );
});

// Middleware global de manejo de errores
app.use(handleErrors);

export default app;