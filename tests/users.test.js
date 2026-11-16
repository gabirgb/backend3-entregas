//Módulo Users
//Valida la obtención de usuarios y los errores esperados (ej. datos incompletos o ID inexistente)

import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { UserModel } from '../src/models/user.model.js';

describe('Módulo Users - /api/users', () => {
    beforeEach(async () => {
        await UserModel.deleteMany({});
    });

    it('POST /api/users - debería registrar un usuario válido (201)', async () => {
        const newUser = {
            firstName: 'Ana',
            lastName: 'Torres',
            email: 'ana.torres@shipnow.test',
            password: 'Password123!',
        };

        const res = await request(app).post('/api/users').send(newUser);

        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
    });

    it('GET /api/users - debería obtener el listado de usuarios con estructura correcta (200)', async () => {
        await UserModel.create({
            firstName: 'Carlos',
            lastName: 'Pérez',
            email: 'carlos.perez@shipnow.test',
            password: 'Password123!',
        });

        const res = await request(app).get('/api/users');

        expect(res.status).to.equal(200);
        // Ajusta si tu API devuelve un array directo o un objeto { status, payload }
        const usersList = Array.isArray(res.body) ? res.body : res.body.payload;
        expect(usersList).to.be.an('array');
        expect(usersList.length).to.be.greaterThan(0);
        expect(usersList[0]).to.have.property('email', 'carlos.perez@shipnow.test');
    });

    it('POST /api/users - debería fallar con datos incompletos (400)', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ firstName: 'Incompleto' });

        expect(res.status).to.be.oneOf([400, 422]);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message');
    });
});