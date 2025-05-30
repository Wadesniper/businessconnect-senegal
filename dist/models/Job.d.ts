import mongoose, { Document } from 'mongoose';
export interface IJob extends Document {
    title: string;
    company: string;
    location: string;
    jobType?: string;
    sector?: string;
    description?: string;
    requirements?: string[];
    contactEmail?: string;
    contactPhone?: string;
    createdBy: string;
}
declare const _default: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob, {}> & IJob & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
