import express from 'express';
import productsRouter from './routes/products.router.js';
import usersRouter from './routes/users.router.js';
import { HTTP_STATUS } from './constants/index.js';
import mocksRouter from './routes/mocks.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/mocks', mocksRouter);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Error interno del servidor',
    });
});

export default app;