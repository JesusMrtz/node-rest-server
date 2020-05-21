/**
 * Port
 */

process.env.PORT = process.env.PORT || 3000;


/**
 * Enviroment
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Vencimiento del token
 * 60 segundos
 * 60 minutos
 * 24 horas
 * 30 dias
 */

process.env.CADUCIDAD_TOKEN = '48h';

/**
 * Semilla de autenticación
 */

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/**
 * Database
 */

let urlDataBase;

if (process.env.NODE_ENV === 'dev') {
    urlDataBase = 'mongodb://localhost:27017/coffee';
} else {
    urlDataBase = process.env.MONGO_URL;
}
process.env.URLDB = urlDataBase;

/**
 * Google client ID
 */

process.env.CLIENT_ID = process.env.CLIENT_ID || '218735265747-8l683b7b89nt52do91msfikpspp1u0gd.apps.googleusercontent.com';