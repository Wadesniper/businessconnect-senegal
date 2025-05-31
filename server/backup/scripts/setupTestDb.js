"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../utils/logger");
dotenv_1.default.config({ path: '.env.test' });
const setupTestDatabase = async () => {
    const client = new pg_1.Client({
        connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres'
    });
    try {
        await client.connect();
        const checkDb = await client.query("SELECT 1 FROM pg_database WHERE datname = 'businessconnect_test'");
        if (checkDb.rowCount === 0) {
            await client.query("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'businessconnect_test'");
            await client.query('CREATE DATABASE businessconnect_test');
            logger_1.logger.info('Base de données de test créée avec succès');
        }
        else {
            logger_1.logger.info('La base de données de test existe déjà');
        }
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de la configuration de la base de données de test:', error);
        process.exit(1);
    }
    finally {
        await client.end();
    }
};
setupTestDatabase().catch((error) => {
    logger_1.logger.error('Erreur non gérée:', error);
    process.exit(1);
});
//# sourceMappingURL=setupTestDb.js.map