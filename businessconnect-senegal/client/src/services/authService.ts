import { User, LoginCredentials, RegisterData } from '../types/user';
import { localStorageService } from './localStorageService';

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    const users = localStorageService.getUsers();
    const user = users.find(u => u.email === credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const { password, ...userWithoutPassword } = user;
    localStorageService.setCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  }

  async register(data: RegisterData): Promise<User> {
    const users = localStorageService.getUsers();
    
    // Vérifier si l'email existe déjà
    if (users.some(u => u.email === data.email)) {
      throw new Error('Cet email est déjà utilisé');
    }

    const newUser: User = {
      id: localStorageService.generateId(),
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: data.role || 'user',
      company: data.company,
      settings: {
        notifications: true,
        newsletter: true,
        language: 'fr',
        theme: 'light'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      password: data.password
    };

    localStorageService.saveUser(newUser);

    // Créer un abonnement gratuit par défaut
    const freeSubscription = {
      id: localStorageService.generateId(),
      userId: newUser.id,
      type: 'free',
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
      autoRenew: false,
      features: ['basic_search', 'cv_creation'],
      price: 0,
      currency: 'XOF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    localStorageService.saveSubscription(freeSubscription);

    const { password, ...userWithoutPassword } = newUser;
    localStorageService.setCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  }

  logout(): void {
    localStorageService.setCurrentUser(null);
  }

  getCurrentUser(): User | null {
    return localStorageService.getCurrentUser();
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.id !== userId) {
      throw new Error('Non autorisé');
    }

    const updatedUser = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorageService.saveUser(updatedUser);
    localStorageService.setCurrentUser(updatedUser);
    return updatedUser;
  }
}

export const authService = new AuthService(); 