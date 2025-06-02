"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const db_1 = require("./utils/db");
const start = async () => {
    try {
        await (0, db_1.connectDB)();
        logger_1.logger.info('Connexion à la base de données établie');
        const port = config_1.config.PORT || 3000;
        app_1.app.listen(port, () => {
            logger_1.logger.info(`Serveur démarré sur le port ${port}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map