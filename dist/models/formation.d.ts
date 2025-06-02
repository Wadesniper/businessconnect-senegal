import { Document } from 'mongoose';
export interface IModule {
    title: string;
    description: string;
    duration: number;
    content: string;
}
export interface IFormation extends Document {
    title: string;
    slug: string;
    description: string;
    instructor: string;
    level: 'débutant' | 'intermédiaire' | 'avancé';
    duration: number;
    price: number;
    category: string;
    tags: string[];
    modules: IModule[];
    enrollments: number;
    cursaUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Formation: import("mongoose").Model<IFormation, {}, {}, {}, Document<unknown, {}, IFormation, {}> & IFormation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
