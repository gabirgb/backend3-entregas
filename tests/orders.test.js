//Módulo Orders & Estados)
// Crea datos controlados previos (un usuario y un producto) y prueba creación, consulta por ID, actualización de estado y errores

import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { UserModel } from '../src/models/user.model.js';
import { ProductModel } from '../src/models/product.model.js';
import { OrderModel } from '../src/models/order.model.js';

describe('Módulo Orders - /api/orders', () => {
    let testUser;
    let testProduct;

    beforeEach(async () => {
        await OrderModel.deleteMany({});
        await UserModel.deleteMany({});
        await ProductModel.deleteMany({});

        testUser = await UserModel.create({
            firstName: 'Cliente',
            lastName: 'Test',
            email: 'cliente@shipnow.test',
            password: 'Password123!',
        });

        testProduct = await ProductModel.create({
            title: 'Caja Reforzada M',
            code: `SKU-${Date.now()}`,
            price: 1500,
            stock: 50,
            category: 'Embalaje',
            description: 'Caja de cartón'
        });
    });

    it('POST /api/orders - debería crear un pedido válido (201)', async () => {
        const orderPayload = {
            client: testUser._id.toString(),
            products: [{ product: testProduct._id.toString(), quantity: 2 }],
            shippingAddress: 'Av. Corrientes 1234, CABA',
        };

        const res = await request(app).post('/api/orders').send(orderPayload);

        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
    });

    it('GET /api/orders/:id - debería retornar 404 ante un ID de pedido inexistente', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/orders/${fakeId}`);

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message');
    });

    it('PATCH /api/orders/:id/status - debería rechazar un estado inválido (400)', async () => {
        const createdOrder = await OrderModel.create({
            client: testUser._id,
            products: [{ product: testProduct._id, quantity: 1 }],
            totalPrice: 1500,
            shippingAddress: 'Calle Falsa 123',
        });

        const res = await request(app)
            .patch(`/api/orders/${createdOrder._id}/status`)
            .send({ status: 'ESTADO_INVENTADO_999' });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('message');
    });
});