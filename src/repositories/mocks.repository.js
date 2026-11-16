import { UserModel } from '../models/user.model.js';
import { ProductModel } from '../models/product.model.js';
import { OrderModel } from '../models/order.model.js';
import { DeliveryModel } from '../models/delivery.model.js';

export class MocksRepository {
    async insertManyUsers(users) {
        return await UserModel.insertMany(users);
    }

    async insertManyProducts(products) {
        return await ProductModel.insertMany(products);
    }

    async insertManyOrders(orders) {
        return await OrderModel.insertMany(orders);
    }

    async insertManyDeliveries(deliveries) {
        return await DeliveryModel.insertMany(deliveries);
    }

    async getAllUsers() {
        return await UserModel.find().lean();
    }

    async getAllProducts() {
        return await ProductModel.find().lean();
    }
}