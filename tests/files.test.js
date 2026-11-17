import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { UserModel } from '../src/models/user.model.js';

describe('Módulo Files — Carga de archivos', () => {
    let testUser;

    beforeEach(async () => {
        await UserModel.deleteMany({});
        testUser = await UserModel.create({
            firstName: 'FileTest',
            lastName: 'User',
            email: 'filetest@shipnow.test',
            password: 'Password123!'
        });
    });

    it('POST /api/users/:uid/documents - debería fallar (400) si no se adjunta archivo', async () => {
        const res = await request(app)
            .post(`/api/users/${testUser._id}/documents`)
            .field('documentType', 'DNI');

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('status', 'error');
    });

    it('POST /api/users/:uid/documents - debería retornar 404 si el usuario no existe', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .post(`/api/users/${fakeId}/documents`)
            .attach('document', Buffer.from('fake pdf content'), 'test.pdf');

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('status', 'error');
    });

    it('POST /api/users/:uid/documents - debería subir el archivo y retornar 200 ante una petición válida', async () => {
        const res = await request(app)
            .post(`/api/users/${testUser._id}/documents`)
            .field('documentType', 'DNI')
            .attach('document', Buffer.from('%PDF-1.4 mock content'), 'dni-test.pdf');

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body.payload).to.have.property('name', 'dni-test.pdf');
    });

});