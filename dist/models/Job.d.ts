import mongoose, { Document } from 'mongoose';
export interface IJob extends Document {
    title: string;
    company: string;
    location: string;
    type?: string;
    sector?: string;
    description?: string;
    requirements?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Job: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob, {}> & IJob & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
