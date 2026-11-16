// Logger, Swagger y 404 Global
// Verifica que la documentación interactiva responda, que el endpoint de prueba de Winston funcione y que las rutas inexistentes devuelvan el formato de error estandarizado

import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Sistema - Logger, Swagger y Manejo de Rutas Inexistentes', () => {
    it('GET /loggerTest - debería ejecutar los niveles de logging correctamente (200)', async () => {
        const res = await request(app).get('/loggerTest');

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
    });

    it('GET /api/docs/ - debería servir la interfaz HTML de Swagger UI (200)', async () => {
        const res = await request(app).get('/api/docs/');

        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.include('text/html');
    });

    it('GET /api/ruta-que-no-existe - debería retornar 404 con el formato de error centralizado', async () => {
        const res = await request(app).get('/api/ruta-que-no-existe');

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message');
    });
});