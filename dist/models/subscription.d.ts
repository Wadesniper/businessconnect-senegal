import mongoose, { Document } from 'mongoose';
export interface ISubscription extends Document {
    userId: string;
    type: 'basic' | 'premium';
    status: 'active' | 'pending' | 'expired' | 'cancelled';
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Subscription: mongoose.Model<ISubscription, {}, {}, {}, mongoose.Document<unknown, {}, ISubscription, {}> & ISubscription & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
