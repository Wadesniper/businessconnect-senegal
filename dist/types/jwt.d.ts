import { Secret, JwtPayload, Algorithm } from 'jsonwebtoken';
export interface JWTPayload extends JwtPayload {
    id: string;
    role: string;
}
export interface JWTConfig {
    secret: Secret;
    expiresIn: string | number;
    algorithm: 'HS256';
}
export interface JWTSignOptions {
    expiresIn?: string | number;
    algorithm?: Algorithm;
}
export declare const defaultJWTConfig: JWTConfig;
export declare const generateToken: (payload: JWTPayload, secret: Secret, options?: JWTSignOptions) => string;
export declare const verifyToken: (token: string, secret: Secret) => JWTPayload;
export interface SignOptions extends SignOptions {
    expiresIn?: string | number;
    algorithm?: SignOptions['algorithm'];
}
