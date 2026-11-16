import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        throw new Error(`[CONFIG ERROR]: Falta la variable de entorno crítica "${varName}". Revisa tu archivo .env`);
    }
}

export const config = Object.freeze({
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV,
});