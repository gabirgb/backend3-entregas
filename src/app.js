import express from 'express';
import productsRouter from './routes/products.router.js';
import usersRouter from './routes/users.router.js';
import mocksRouter from './routes/mocks.router.js';
import { handleErrors } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/mocks', mocksRouter);

// Middleware global de manejo de errores
app.use(handleErrors);

export default app;