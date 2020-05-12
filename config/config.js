/**
 * Port
 */

process.env.PORT = process.env.PORT || 3000;


/**
 * Enviroment
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/**
 * Database
 */

let urlDataBase;

if (process.env.NODE_ENV === 'dev') {
    urlDataBase = 'mongodb://localhost:27017/coffee';
} else {
    urlDataBase = process.env.NODE_ENV.MONGO_URL;
}

process.env.URLDB = urlDataBase;