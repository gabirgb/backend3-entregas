export class CustomError {
    static createError({ name = 'Error', cause = '', message, code, status }) {
        const error = new Error(message);
        error.name = name;
        error.cause = cause;
        error.code = code;
        error.statusCode = status;
        return error;
    }
}