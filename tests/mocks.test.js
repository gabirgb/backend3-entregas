// Módulo Mocks
// Valida la generación exitosa y el rechazo ante cantidades negativas o no numéricas

import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Módulo Mocks - /api/mocks', () => {
    it('GET /api/mocks/users?qty=5 - debería generar exactamente 5 usuarios mock (200)', async () => {
        const res = await request(app).get('/api/mocks/users?qty=5');

        expect(res.status).to.equal(200);
        const data = Array.isArray(res.body) ? res.body : res.body.payload;
        expect(data).to.be.an('array').with.lengthOf(5);
        expect(data[0]).to.have.property('email');
    });

    it('GET /api/mocks/users?qty=-3 - debería devolver error 400 ante cantidad inválida', async () => {
        const res = await request(app).get('/api/mocks/users?qty=-3');

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message');
    });
});