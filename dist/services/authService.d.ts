import { IUser } from '../models/User';
export declare class AuthService {
    static validateUser(email: string, password: string): Promise<IUser | null>;
    static generateAuthToken(user: IUser): Promise<string>;
    static register(userData: Partial<IUser>): Promise<IUser>;
    static requestPasswordReset(email: string): Promise<void>;
    static resetPassword(token: string, newPassword: string): Promise<void>;
}
