import { logger } from '../config/logger.config.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { USER_ROLES } from '../constants/index.js';
import { CustomError } from './errors/custom-error.js';
import { ERROR_DICTIONARY } from '../constants/error-dictionary.js';

export class UsersService {
    constructor() {
        this.usersRepository = new UsersRepository();
    }

    async getUsers() {
        return await this.usersRepository.getAll();
    }

    async getUserById(id) {
        const user = await this.usersRepository.getById(id);
        if (!user) {
            const errInfo = ERROR_DICTIONARY.USER_NOT_FOUND;
            throw CustomError.createError({
                name: 'UserNotFoundError',
                cause: `No se encontró ningún usuario con el ID: ${id}`,
                message: errInfo.message,
                code: errInfo.code,
                status: errInfo.status,
            });
        }
        return user;
    }

    async createUser(data) {
        const existing = await this.usersRepository.getByEmail(data.email);
        if (existing) {
            const errInfo = ERROR_DICTIONARY.USER_ALREADY_EXISTS;
            throw CustomError.createError({
                name: 'UserAlreadyExistsError',
                cause: `El email ${data.email} ya se encuentra registrado.`,
                message: errInfo.message,
                code: errInfo.code,
                status: errInfo.status,
            });
        }

        // SEGURIDAD: Forzamos siempre el rol por defecto (USER) al registrarse.
        // Ignoramos cualquier intento de inyección de roles (como "ADMIN") desde el req.body.
        const created = await this.usersRepository.create({ ...data, role: USER_ROLES.USER, });
        logger.info(`Usuario creado correctamente: ${created.firstName} ${created.lastName} (Email: ${created.email})`, { id: created._id });

        return created;
    }

    async updateUser(id, updateData) {
        await this.getUserById(id);

        // Opcional: Si quieres permitir que mediante una ruta de actualización (update) 
        // un admin pueda cambiar roles en el futuro, puedes dejar la validación aquí,
        // pero para el registro público (createUser) ya quedó blindado arriba.
        if (updateData.role && !Object.values(USER_ROLES).includes(updateData.role)) {
            const errInfo = ERROR_DICTIONARY.INVALID_USER_ROLE;
            throw CustomError.createError({
                name: 'InvalidUserRoleError',
                cause: `El rol ${updateData.role} no es válido.`,
                message: errInfo.message,
                code: errInfo.code,
                status: errInfo.status,
            });
        }

        return await this.usersRepository.update(id, updateData);
    }

    async deleteUser(id) {
        await this.getUserById(id);
        return await this.usersRepository.softDelete(id);
    }
}