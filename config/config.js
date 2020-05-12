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
    urlDataBase = 'mongodb+srv://JesusMrtzTorres:2AXgI4V3lAg3OzHt@cluster0-i9jzm.mongodb.net/coffee';
}

process.env.URLDB = urlDataBase;