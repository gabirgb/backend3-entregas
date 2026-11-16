import { UsersService } from '../services/users.service.js';
import { HTTP_STATUS } from '../constants/index.js';

const usersService = new UsersService();

export class UsersController {
    static async getAll(req, res, next) {
        try {
            const users = await usersService.getUsers();
            res.status(HTTP_STATUS.OK).json({ status: 'success', payload: users });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const user = await usersService.getUserById(req.params.uid);
            res.status(HTTP_STATUS.OK).json({ status: 'success', payload: user });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const created = await usersService.createUser(req.body);
            res.status(HTTP_STATUS.CREATED).json({ status: 'success', payload: created });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const updated = await usersService.updateUser(req.params.uid, req.body);
            res.status(HTTP_STATUS.OK).json({ status: 'success', payload: updated });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            await usersService.deleteUser(req.params.uid);
            res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Usuario eliminado' });
        } catch (error) {
            next(error);
        }
    }
}