"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
async function checkHealth() {
    try {
        // Vérifier la connexion à la base de données
        const dbCheck = await checkDatabase();
        // Vérifier la connexion avec le frontend
        const frontendCheck = await checkFrontend();
        console.log({
            database: dbCheck ? '✅' : '❌',
            frontend: frontendCheck ? '✅' : '❌'
        });
        return dbCheck && frontendCheck;
    }
    catch (error) {
        console.error('Erreur lors de la vérification :', error);
        return false;
    }
}
async function checkDatabase() {
    try {
        // Ajouter votre logique de vérification DB ici
        return true;
    }
    catch (_a) {
        return false;
    }
}
async function checkFrontend() {
    try {
        const response = await axios_1.default.get(config_1.config.CLIENT_URL);
        return response.status === 200;
    }
    catch (_a) {
        return false;
    }
}
// Exécuter le script
checkHealth();
