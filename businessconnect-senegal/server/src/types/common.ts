import { Document, Types } from 'mongoose';

export interface BaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type WithId<T> = T & { id: string };
export type WithTimestamps<T> = T & { createdAt: Date; updatedAt: Date };
export type WithMongoId<T> = T & { _id: Types.ObjectId };

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: { [key: string]: 1 | -1 };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type MongooseToDTO<T> = Omit<T, '_id' | '__v'> & { id: string };
export type DTOToMongoose<T> = Omit<T, 'id'> & { _id: Types.ObjectId }; 