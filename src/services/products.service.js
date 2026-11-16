import { ProductsRepository } from '../repositories/products.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';

export class ProductsService {
    constructor() {
        this.productsRepository = new ProductsRepository();
    }

    async getProducts({ onlyAvailable = false } = {}) {
        const products = await this.productsRepository.getAll();

        // Regla de negocio: filtrar productos sin stock si se solicita o marcar estado coherente
        if (onlyAvailable) {
            return products.filter(
                (p) => p.stock > 0 && p.status === PRODUCT_STATUS.AVAILABLE
            );
        }

        return products;
    }

    async getProductById(id) {
        const product = await this.productsRepository.getById(id);
        if (!product) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error;
        }
        return product;
    }

    async createProduct(data) {
        const existing = await this.productsRepository.getByCode(data.code);
        if (existing) {
            const error = new Error(`Ya existe un producto con el código ${data.code}`);
            error.statusCode = 400;
            throw error;
        }

        // Regla de negocio: determinar estado inicial según stock
        const status =
            data.stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK;

        return await this.productsRepository.create({
            ...data,
            status,
        });
    }

    async updateProduct(id, updateData) {
        await this.getProductById(id); // Verifica existencia

        // Si actualizan el stock, sincronizamos el estado automáticamente
        if (typeof updateData.stock === 'number') {
            updateData.status =
                updateData.stock > 0
                    ? PRODUCT_STATUS.AVAILABLE
                    : PRODUCT_STATUS.OUT_OF_STOCK;
        }

        return await this.productsRepository.update(id, updateData);
    }

    async deleteProduct(id) {
        await this.getProductById(id);
        return await this.productsRepository.softDelete(id);
    }
}