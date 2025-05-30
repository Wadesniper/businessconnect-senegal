import { z } from 'zod';
export declare const UserValidationSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["user", "admin"]>>;
    phone: z.ZodEffects<z.ZodString, string, string>;
    isVerified: z.ZodDefault<z.ZodBoolean>;
    resetPasswordToken: z.ZodOptional<z.ZodString>;
    resetPasswordExpire: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    name: string;
    createdAt: Date;
    password: string;
    role: "user" | "admin";
    phone: string;
    isVerified: boolean;
    email?: string | undefined;
    resetPasswordToken?: string | undefined;
    resetPasswordExpire?: Date | undefined;
}, {
    name: string;
    password: string;
    phone: string;
    createdAt?: Date | undefined;
    email?: string | undefined;
    role?: "user" | "admin" | undefined;
    isVerified?: boolean | undefined;
    resetPasswordToken?: string | undefined;
    resetPasswordExpire?: Date | undefined;
}>;
export interface IUser {
    _id: string;
    name: string;
    email?: string;
    password: string;
    role: 'user' | 'admin';
    phone: string;
    isVerified: boolean;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt: Date;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, import("mongoose").Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
