import jwt from 'jsonwebtoken';
export declare const generateToken: (payload: string | object | Buffer, secret?: string, options?: jwt.SignOptions) => string;
export declare const verifyToken: (token: string, secret?: string) => object | string;
