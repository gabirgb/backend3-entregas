import { faker } from '@faker-js/faker';
import { USER_ROLES, PRODUCT_STATUS, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } from '../constants/index.js';
import { MocksRepository } from '../repositories/mocks.repository.js';
import { CustomError } from './errors/custom-error.js';
import { ERROR_DICTIONARY } from '../constants/error-dictionary.js';

export class MocksService {
    constructor() {
        this.mocksRepository = new MocksRepository();
    }

    // Validador auxiliar de cantidad
    validateQuantity(qty) {
        // Si no se envía qty, retornamos el valor por defecto (10)
        if (qty === undefined || qty === null || qty === '') {
            return 10;
        }

        const parsedQty = Number(qty);
        if (isNaN(parsedQty) || parsedQty <= 0) {
            const errInfo = ERROR_DICTIONARY.INVALID_MOCK_QUANTITY;
            throw CustomError.createError({
                name: 'InvalidMockQuantityError',
                cause: `Se recibió un valor de cantidad inválido: "${qty}". Debe ser un número entero mayor a 0.`,
                message: errInfo.message,
                code: errInfo.code,
                status: errInfo.status,
            });
        }
        return parsedQty;
    }

    generateMockUsers(qty) {
        const validQty = this.validateQuantity(qty);
        const users = [];
        for (let i = 0; i < validQty; i++) {
            users.push({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 8 }),
                role: faker.helpers.arrayElement(Object.values(USER_ROLES)),
                isActive: true,
            });
        }
        return users;
    }

    generateMockProducts(qty) {
        const validQty = this.validateQuantity(qty);
        const products = [];
        for (let i = 0; i < validQty; i++) {
            const stock = faker.number.int({ min: 0, max: 50 });
            products.push({
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                code: `SKU-${faker.string.alphanumeric(6).toUpperCase()}`,
                price: Number(faker.commerce.price({ min: 10, max: 1000 })),
                stock,
                category: faker.commerce.department(),
                status: stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK,
                isActive: true,
            });
        }
        return products;
    }

    async seedDatabase(qty) {
        const validQty = this.validateQuantity(qty);
        try {
            const mockUsers = this.generateMockUsers(validQty);
            const insertedUsers = await this.mocksRepository.insertManyUsers(mockUsers);

            const mockProducts = this.generateMockProducts(validQty);
            const insertedProducts = await this.mocksRepository.insertManyProducts(mockProducts);

            const userIds = insertedUsers.map((u) => u._id);
            const productIds = insertedProducts.map((p) => p._id);
            const deliveryDrivers = insertedUsers.filter((u) => u.role === USER_ROLES.DELIVERY);

            const orders = [];
            for (let i = 0; i < validQty; i++) {
                orders.push({
                    client: faker.helpers.arrayElement(userIds),
                    products: [{ product: faker.helpers.arrayElement(productIds), quantity: 1 }],
                    totalPrice: Number(faker.commerce.price({ min: 50, max: 1000 })),
                    status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
                    priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
                    shippingAddress: faker.location.streetAddress(),
                    isActive: true,
                });
            }
            const insertedOrders = await this.mocksRepository.insertManyOrders(orders);

            const deliveries = insertedOrders.map((order) => ({
                order: order._id,
                driver: deliveryDrivers.length > 0 ? faker.helpers.arrayElement(deliveryDrivers)._id : userIds[0],
                status: faker.helpers.arrayElement(Object.values(DELIVERY_STATUS)),
                estimatedDeliveryTime: faker.date.soon({ days: 3 }),
                trackingCode: `TRK-${faker.string.alphanumeric(8).toUpperCase()}`,
                isActive: true,
            }));
            await this.mocksRepository.insertManyDeliveries(deliveries);

            return {
                message: 'Base de datos poblada exitosamente con datos de prueba',
                stats: {
                    usersInserted: insertedUsers.length,
                    productsInserted: insertedProducts.length,
                    ordersInserted: insertedOrders.length,
                    deliveriesInserted: deliveries.length,
                },
            };
        } catch (error) {
            // Si el error ya es un CustomError creado por nosotros, lo re-lanzamos
            if (error.statusCode) throw error;

            // Si ocurre un fallo en MongoDB durante la inserción
            const errInfo = ERROR_DICTIONARY.SEEDING_ERROR;
            throw CustomError.createError({
                name: 'SeedingExecutionError',
                cause: error.message,
                message: errInfo.message,
                code: errInfo.code,
                status: errInfo.status,
            });
        }
    }
}