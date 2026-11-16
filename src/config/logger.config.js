import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from './env.config.js';

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'bold red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    },
};

winston.addColors(customLevelsOptions.colors);

// Formato unificado para archivos (texto limpio y estructurado)
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        const stackString = stack ? `\n${stack}` : '';
        return `${timestamp} [${level.padEnd(7)}] ${message}${metaString}${stackString}`;
    })
);

// Formato para consola (con colores por nivel)
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${level}] ${message}${metaString}`;
    })
);

// Transporte de rotación diaria exclusivamente para errores (error y fatal)
const errorRotateTransport = new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error', // Captura 'error' (1) y 'fatal' (0)
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
});

// Transporte de rotación para historial general en producción
const combinedRotateTransport = new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'info',
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
});

// Selección de transportes según el entorno (development vs production)
const isProduction = config.nodeEnv === 'production';

const transports = [
    new winston.transports.Console({
        level: isProduction ? 'info' : 'debug',
        format: consoleFormat,
    }),
    errorRotateTransport,
];

if (isProduction) {
    transports.push(combinedRotateTransport);
}

export const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports,
});