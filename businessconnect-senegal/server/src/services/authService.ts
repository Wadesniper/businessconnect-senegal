import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  subscription?: {
    type: 'etudiant' | 'annonceur' | 'recruteur';
    status: 'active' | 'pending' | 'expired';
    expiresAt: string;
  };
}

const USERS_FILE = path.join(__dirname, '../data/users.json');
const jwtSecret: any = process.env.JWT_SECRET || 'default_secret';
const jwtExpire: any = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '24h';
const options: jwt.SignOptions = { expiresIn: jwtExpire };

// Assurez-vous que le dossier data existe
async function ensureDataDirectory() {
  const dir = path.dirname(USERS_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Charger les utilisateurs depuis le fichier
async function loadUsers(): Promise<Map<string, User>> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    const users = JSON.parse(data);
    return new Map(Object.entries(users));
  } catch (error) {
    logger.info('Aucun fichier utilisateurs trouvé, création d\'un nouveau fichier');
    return new Map();
  }
}

// Sauvegarder les utilisateurs dans le fichier
async function saveUsers(users: Map<string, User>): Promise<void> {
  try {
    await ensureDataDirectory();
    const data = JSON.stringify(Object.fromEntries(users), null, 2);
    await fs.writeFile(USERS_FILE, data, 'utf-8');
  } catch (error) {
    logger.error('Erreur lors de la sauvegarde des utilisateurs:', error);
  }
}

class AuthService {
  private users: Map<string, User>;
  private initialized: boolean = false;

  constructor() {
    this.users = new Map();
    this.init();
  }

  private async init() {
    if (!this.initialized) {
      this.users = await loadUsers();
      this.initialized = true;
      
      // Sauvegarde périodique toutes les 5 minutes
      setInterval(() => {
        saveUsers(this.users);
      }, 5 * 60 * 1000);
    }
  }

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, storedHash] = hashedPassword.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return storedHash === hash;
  }

  async register(userData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }): Promise<{ user: Omit<User, 'passwordHash'>, token: string }> {
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

    const user: User = {
      id: crypto.randomUUID(),
      fullName: userData.fullName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      passwordHash: this.hashPassword(userData.password)
    };

    this.users.set(user.id, user);
    await saveUsers(this.users);

    const token = jwt.sign(
      { userId: user.id },
      jwtSecret,
      options
    );
    const { passwordHash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async login(identifier: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>, token: string }> {
    await this.init();

    // Rechercher l'utilisateur par numéro de téléphone ou nom complet
    const user = Array.from(this.users.values()).find(
      u => u.phoneNumber === identifier || u.fullName === identifier
    );

    if (!user) {
      throw new Error('Identifiants invalides');
    }

    if (!this.verifyPassword(password, user.passwordHash)) {
      throw new Error('Identifiants invalides');
    }

    const token = jwt.sign(
      { userId: user.id },
      jwtSecret,
      options
    );
    const { passwordHash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async verifyToken(token: string): Promise<Omit<User, 'passwordHash'>> {
    try {
      const decoded = jwt.verify(token, jwtSecret) as { userId: string };
      const user = this.users.get(decoded.userId);

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Token invalide');
    }
  }

  async updateUserSubscription(userId: string, subscription: User['subscription']): Promise<void> {
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

export const authService = new AuthService(); 