"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const os_1 = __importDefault(require("os"));
const router = (0, express_1.Router)();
router.get('/health', (req, res) => {
    const healthData = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        memory: {
            total: os_1.default.totalmem(),
            free: os_1.default.freemem(),
            used: os_1.default.totalmem() - os_1.default.freemem(),
            usage: ((os_1.default.totalmem() - os_1.default.freemem()) / os_1.default.totalmem() * 100).toFixed(2) + '%'
        },
        cpu: {
            cores: os_1.default.cpus().length,
            model: os_1.default.cpus()[0].model,
            load: os_1.default.loadavg()
        },
        platform: os_1.default.platform(),
        hostname: os_1.default.hostname(),
        status: 'healthy'
    };
    res.json(healthData);
});
exports.default = router;
//# sourceMappingURL=health.js.map