export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    password: string;
    role: 'admin' | 'etudiant' | 'annonceur' | 'recruteur';
    phoneNumber: string;
    isVerified: boolean;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt: Date;
    preferences?: {
        notifications: boolean;
        newsletter: boolean;
        language: string;
    };
    notifications?: Array<{
        _id: string;
        message: string;
        read: boolean;
        createdAt: Date;
    }>;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, import("mongoose").Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
