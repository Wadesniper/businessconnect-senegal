"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pg_1 = require("pg");
const config_1 = require("../config");
const router = (0, express_1.Router)();
const pool = new pg_1.Pool({ connectionString: config_1.config.DATABASE_URL });
router.get('/', async (_req, res) => {
    try {
        const status = {
            timestamp: new Date().toISOString(),
            database: false,
            server: true
        };
        try {
            await pool.query('SELECT NOW()');
            status.database = true;
        }
        catch (error) {
            console.error('Erreur DB:', error);
        }
        const isHealthy = status.database && status.server;
        res.status(isHealthy ? 200 : 503).json({
            status: isHealthy ? 'healthy' : 'unhealthy',
            ...status
        });
    }
    catch (error) {
        console.error('Erreur healthcheck:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=healthcheck.js.map