import { ProductsRepository } from '../repositories/products.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';
import { CustomError } from './errors/custom-error.js';
import { ERROR_DICTIONARY } from '../constants/error-dictionary.js';

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
            const errInfo = ERROR_DICTIONARY.PRODUCT_NOT_FOUND;
            throw CustomError.createError({
                name: 'ProductNotFoundError',
                cause: `No se encontró ningún producto activo con el ID: ${id}`,
                message: errInfo.message,
                code: errInfo.code,
                status: errInfo.status,
            });
        }
        return product;
    }

    async createProduct(data) {
        const existing = await this.productsRepository.getByCode(data.code);
        if (existing) {
            const errInfo = ERROR_DICTIONARY.PRODUCT_ALREADY_EXISTS;
            throw CustomError.createError({
                name: 'ProductAlreadyExistsError',
                cause: `El código SKU ${data.code} ya está registrado.`,
                message: errInfo.message,
                code: errInfo.code,
                status: errInfo.status,
            });
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