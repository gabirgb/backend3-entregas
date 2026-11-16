import { MocksService } from '../services/mocks.service.js';
import { HTTP_STATUS } from '../constants/index.js';

const mocksService = new MocksService();

export class MocksController {
    static getMockUsers(req, res, next) {
        try {
            // Pasamos req.query.qty tal cual para que el Service lo valide
            const users = mocksService.generateMockUsers(req.query.qty);
            res.status(HTTP_STATUS.OK).json({ status: 'success', qty: users.length, payload: users });
        } catch (error) {
            next(error);
        }
    }

    static getMockProducts(req, res, next) {
        try {
            const products = mocksService.generateMockProducts(req.query.qty);
            res.status(HTTP_STATUS.OK).json({ status: 'success', qty: products.length, payload: products });
        } catch (error) {
            next(error);
        }
    }

    static async seedDatabase(req, res, next) {
        try {
            const result = await mocksService.seedDatabase(req.query.qty);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', ...result });
        } catch (error) {
            next(error);
        }
    }
}