import { faker } from '@faker-js/faker';
import { USER_ROLES, PRODUCT_STATUS, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } from '../constants/index.js';
import { MocksRepository } from '../repositories/mocks.repository.js';

export class MocksService {
    constructor() {
        this.mocksRepository = new MocksRepository();
    }

    // --- GENERADORES DE DATOS EN MEMORIA (Sin guardar en DB) ---

    generateMockUsers(qty = 10) {
        const users = [];
        for (let i = 0; i < qty; i++) {
            const rolesArray = Object.values(USER_ROLES);
            users.push({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 8 }),
                role: faker.helpers.arrayElement(rolesArray),
                isActive: true,
            });
        }
        return users;
    }

    generateMockProducts(qty = 10) {
        const products = [];
        for (let i = 0; i < qty; i++) {
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

    generateMockOrders(qty = 5, userIds = [], productIds = []) {
        const orders = [];
        for (let i = 0; i < qty; i++) {
            orders.push({
                client: faker.helpers.arrayElement(userIds),
                products: [
                    {
                        product: faker.helpers.arrayElement(productIds),
                        quantity: faker.number.int({ min: 1, max: 5 }),
                    },
                ],
                totalPrice: Number(faker.commerce.price({ min: 50, max: 2000 })),
                status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
                priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
                shippingAddress: faker.location.streetAddress(),
                isActive: true,
            });
        }
        return orders;
    }

    // --- LÓGICA DE SEEDING (Inserción controlada en MongoDB) ---

    async seedDatabase(qty = 10) {
        try {
            // 1. Generar e insertar usuarios (asegurando repartidores y clientes)
            const mockUsers = this.generateMockUsers(qty);
            const insertedUsers = await this.mocksRepository.insertManyUsers(mockUsers);

            // 2. Generar e insertar productos
            const mockProducts = this.generateMockProducts(qty);
            const insertedProducts = await this.mocksRepository.insertManyProducts(mockProducts);

            // Obtener IDs válidos para relaciones
            const userIds = insertedUsers.map((u) => u._id);
            const productIds = insertedProducts.map((p) => p._id);
            const deliveryDrivers = insertedUsers.filter((u) => u.role === USER_ROLES.DELIVERY);

            // 3. Generar e insertar órdenes vinculadas a usuarios y productos
            const rawOrders = this.generateMockOrders(qty, userIds, productIds);
            const insertedOrders = await this.mocksRepository.insertManyOrders(rawOrders);

            // 4. Generar e insertar entregas vinculadas a órdenes y repartidores
            const deliveries = insertedOrders.map((order, index) => {
                const driver = deliveryDrivers.length > 0
                    ? faker.helpers.arrayElement(deliveryDrivers)._id
                    : userIds[0]; // Fallback si no se generó ningún driver con ese rol exacto

                return {
                    order: order._id,
                    driver,
                    status: faker.helpers.arrayElement(Object.values(DELIVERY_STATUS)),
                    estimatedDeliveryTime: faker.date.soon({ days: 3 }),
                    trackingCode: `TRK-${faker.string.alphanumeric(8).toUpperCase()}`,
                    isActive: true,
                };
            });

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
            const err = new Error(`Error en el proceso de seeding: ${error.message}`);
            err.statusCode = 500;
            throw err;
        }
    }
}