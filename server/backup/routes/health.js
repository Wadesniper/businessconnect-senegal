"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        // Vérifier la connexion à MongoDB
        const dbState = mongoose_1.default.connection.readyState;
        const dbStatus = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        // Vérifier l'utilisation de la mémoire
        const memoryUsage = process.memoryUsage();
        res.status(200).json({
            status: 'success',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: {
                status: dbStatus[dbState],
                connected: dbState === 1
            },
            memory: {
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
                rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB'
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la vérification de santé',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
