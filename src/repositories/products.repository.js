import { ProductModel } from '../models/product.model.js';

export class ProductsRepository {
    async getAll(filters = {}) {
        // Encapsula filtro por defecto (solo activos) y proyección (oculta __v)
        return await ProductModel.find({ isActive: true, ...filters })
            .select('-__v')
            .lean();
    }

    async getById(id) {
        return await ProductModel.findOne({ _id: id, isActive: true })
            .select('-__v')
            .lean();
    }

    async getByCode(code) {
        return await ProductModel.findOne({ code }).lean();
    }

    async create(productData) {
        const newProduct = await ProductModel.create(productData);
        return newProduct.toObject();
    }

    async update(id, updateData) {
        return await ProductModel.findOneAndUpdate(
            { _id: id, isActive: true },
            updateData,
            { new: true, runValidators: true }
        )
            .select('-__v')
            .lean();
    }

    async softDelete(id) {
        return await ProductModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        ).lean();
    }
}