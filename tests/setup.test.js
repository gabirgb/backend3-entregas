//(Conexión y limpieza de Base de Datos)
// Este archivo maneja la conexión a la base de datos de testing antes de toda la suite y asegura una limpieza controlada

import mongoose from 'mongoose';

import { config } from '../src/config/env.config.js';

before(async function () {
    this.timeout(10000);
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(config.mongoUri);
    }
});

after(async function () {
    // Limpieza final de colecciones tras terminar toda la suite
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        await mongoose.connection.collections[collectionName].deleteMany({});
    }
    await mongoose.connection.close();
});