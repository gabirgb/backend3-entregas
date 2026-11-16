import { ProductsService } from '../services/products.service.js';
import { HTTP_STATUS } from '../constants/index.js';

const productsService = new ProductsService();

export class ProductsController {
    static async getAll(req, res, next) {
        try {
            const onlyAvailable = req.query.available === 'true';
            const products = await productsService.getProducts({ onlyAvailable });
            res.status(HTTP_STATUS.OK).json({ status: 'success', payload: products });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const product = await productsService.getProductById(req.params.pid);
            res.status(HTTP_STATUS.OK).json({ status: 'success', payload: product });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const created = await productsService.createProduct(req.body);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', payload: created });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const updated = await productsService.updateProduct(req.params.pid, req.body);
            res.status(HTTP_STATUS.OK).json({ status: 'success', payload: updated });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            await productsService.deleteProduct(req.params.pid);
            res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Producto eliminado' });
        } catch (error) {
            next(error);
        }
    }
}