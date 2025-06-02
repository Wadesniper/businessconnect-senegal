import mongoose, { Document } from 'mongoose';
export interface ISubscription {
    type: 'etudiant' | 'annonceur' | 'recruteur';
    status: 'active' | 'expired';
    startDate: Date;
    endDate: Date;
    paymentId?: string;
}
export interface IUser extends Document {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: 'admin' | 'etudiant' | 'annonceur' | 'recruteur';
    isVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    subscription?: ISubscription;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
