"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.cleanTestDatabase = exports.initTestDatabase = exports.query = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../utils/logger");
dotenv_1.default.config({ path: '.env.test' });
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxUses: 7500,
});
pool.on('connect', () => {
    logger_1.logger.info('Nouvelle connexion au pool PostgreSQL');
});
pool.on('error', (err) => {
    logger_1.logger.error('Erreur inattendue du pool PostgreSQL:', err);
    process.exit(-1);
});
pool.on('acquire', () => {
    logger_1.logger.debug('Client acquis depuis le pool');
});
pool.on('remove', () => {
    logger_1.logger.info('Client retiré du pool');
});
const query = async (text, params) => {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    }
    finally {
        client.release();
    }
};
exports.query = query;
exports.default = pool;
const initTestDatabase = async () => {
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('Cette fonction ne doit être appelée que dans l\'environnement de test');
    }
    try {
        await (0, exports.query)(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        logger_1.logger.info('Base de données de test initialisée avec succès');
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de l\'initialisation de la base de données de test', error);
        throw error;
    }
};
exports.initTestDatabase = initTestDatabase;
const cleanTestDatabase = async () => {
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('Cette fonction ne doit être appelée que dans l\'environnement de test');
    }
    try {
        await (0, exports.query)('TRUNCATE TABLE subscriptions CASCADE');
        logger_1.logger.info('Base de données de test nettoyée avec succès');
    }
    catch (error) {
        logger_1.logger.error('Erreur lors du nettoyage de la base de données de test', error);
        throw error;
    }
};
exports.cleanTestDatabase = cleanTestDatabase;
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Connexion à PostgreSQL réussie !');
        client.release();
        return true;
    }
    catch (error) {
        console.error('Erreur de connexion à PostgreSQL:', error);
        return false;
    }
};
exports.testConnection = testConnection;
//# sourceMappingURL=database.js.map