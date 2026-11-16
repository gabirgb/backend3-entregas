import { UserModel } from '../models/user.model.js';

export class UsersRepository {
    async getAll(filters = {}) {
        // Proyección: nunca exponemos password ni __v por defecto
        return await UserModel.find({ isActive: true, ...filters })
            .select('-password -__v')
            .lean();
    }

    async getById(id) {
        return await UserModel.findOne({ _id: id, isActive: true })
            .select('-password -__v')
            .lean();
    }

    async getByEmail(email) {
        return await UserModel.findOne({ email, isActive: true }).lean();
    }

    async create(userData) {
        const created = await UserModel.create(userData);
        const userObj = created.toObject();
        delete userObj.password;
        return userObj;
    }

    async update(id, updateData) {
        return await UserModel.findOneAndUpdate(
            { _id: id, isActive: true },
            updateData,
            { new: true, runValidators: true }
        )
            .select('-password -__v')
            .lean();
    }

    async softDelete(id) {
        return await UserModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        )
            .select('-password -__v')
            .lean();
    }
}