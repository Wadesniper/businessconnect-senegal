"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
const USERS_FILE = path_1.default.join(__dirname, '../data/users.json');
const jwtSecret = process.env.JWT_SECRET || 'default_secret';
const jwtExpire = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '24h';
const options = { expiresIn: jwtExpire };
// Assurez-vous que le dossier data existe
async function ensureDataDirectory() {
    const dir = path_1.default.dirname(USERS_FILE);
    try {
        await promises_1.default.access(dir);
    }
    catch (_a) {
        await promises_1.default.mkdir(dir, { recursive: true });
    }
}
// Charger les utilisateurs depuis le fichier
async function loadUsers() {
    try {
        await ensureDataDirectory();
        const data = await promises_1.default.readFile(USERS_FILE, 'utf-8');
        const users = JSON.parse(data);
        return new Map(Object.entries(users));
    }
    catch (error) {
        logger_1.default.info('Aucun fichier utilisateurs trouvé, création d\'un nouveau fichier');
        return new Map();
    }
}
// Sauvegarder les utilisateurs dans le fichier
async function saveUsers(users) {
    try {
        await ensureDataDirectory();
        const data = JSON.stringify(Object.fromEntries(users), null, 2);
        await promises_1.default.writeFile(USERS_FILE, data, 'utf-8');
    }
    catch (error) {
        logger_1.default.error('Erreur lors de la sauvegarde des utilisateurs:', error);
    }
}
class AuthService {
    constructor() {
        this.initialized = false;
        this.users = new Map();
        this.init();
    }
    async init() {
        if (!this.initialized) {
            this.users = await loadUsers();
            this.initialized = true;
            // Sauvegarde périodique toutes les 5 minutes
            setInterval(() => {
                saveUsers(this.users);
            }, 5 * 60 * 1000);
        }
    }
    hashPassword(password) {
        const salt = crypto_1.default.randomBytes(16).toString('hex');
        const hash = crypto_1.default.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return `${salt}:${hash}`;
    }
    verifyPassword(password, hashedPassword) {
        const [salt, storedHash] = hashedPassword.split(':');
        const hash = crypto_1.default.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return storedHash === hash;
    }
    async register(userData) {
        await this.init();
        // Vérifier si l'email ou le numéro de téléphone existe déjà
        const existingUserByEmail = Array.from(this.users.values()).find(u => u.email === userData.email);
        const existingUserByPhone = Array.from(this.users.values()).find(u => u.phoneNumber === userData.phoneNumber);
        if (existingUserByEmail) {
            throw new Error('Cet email est déjà utilisé');
        }
        if (existingUserByPhone) {
            throw new Error('Ce numéro de téléphone est déjà utilisé');
        }
        const user = {
            id: crypto_1.default.randomUUID(),
            fullName: userData.fullName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            passwordHash: this.hashPassword(userData.password)
        };
        this.users.set(user.id, user);
        await saveUsers(this.users);
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, options);
        const { passwordHash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async login(identifier, password) {
        await this.init();
        // Rechercher l'utilisateur par numéro de téléphone ou nom complet
        const user = Array.from(this.users.values()).find(u => u.phoneNumber === identifier || u.fullName === identifier);
        if (!user) {
            throw new Error('Identifiants invalides');
        }
        if (!this.verifyPassword(password, user.passwordHash)) {
            throw new Error('Identifiants invalides');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, options);
        const { passwordHash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            const user = this.users.get(decoded.userId);
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            const { passwordHash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            throw new Error('Token invalide');
        }
    }
    async updateUserSubscription(userId, subscription) {
        await this.init();
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        user.subscription = subscription;
        this.users.set(userId, user);
        await saveUsers(this.users);
    }
}
exports.authService = new AuthService();
