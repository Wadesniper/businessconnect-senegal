"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const logger_1 = require("./logger");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(config_1.config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    }
    catch (error) {
        logger_1.logger.error('Erreur de connexion à MongoDB:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map