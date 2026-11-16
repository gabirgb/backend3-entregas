import { UsersRepository } from '../repositories/users.repository.js';
import { USER_ROLES } from '../constants/index.js';

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
            const error = new Error('Usuario no encontrado');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }

    async createUser(data) {
        const existing = await this.usersRepository.getByEmail(data.email);
        if (existing) {
            const error = new Error('El correo electrónico ya está registrado');
            error.statusCode = 400;
            throw error;
        }

        // SEGURIDAD: Forzamos siempre el rol por defecto (USER) al registrarse.
        // Ignoramos cualquier intento de inyección de roles (como "ADMIN") desde el req.body.
        return await this.usersRepository.create({
            ...data,
            role: USER_ROLES.USER,
        });
    }

    async updateUser(id, updateData) {
        await this.getUserById(id);

        // Opcional: Si quieres permitir que mediante una ruta de actualización (update) 
        // un admin pueda cambiar roles en el futuro, puedes dejar la validación aquí,
        // pero para el registro público (createUser) ya quedó blindado arriba.
        if (updateData.role && !Object.values(USER_ROLES).includes(updateData.role)) {
            const error = new Error('Rol de usuario inválido');
            error.statusCode = 400;
            throw error;
        }

        return await this.usersRepository.update(id, updateData);
    }

    async deleteUser(id) {
        await this.getUserById(id);
        return await this.usersRepository.softDelete(id);
    }
}