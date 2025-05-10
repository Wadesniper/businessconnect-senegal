import { Document, Types } from 'mongoose';

export interface BaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDelete {
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface Auditable extends Timestamps {
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export interface BaseModel<T extends Document> {
  _id: Types.ObjectId;
  save(): Promise<T>;
  remove(): Promise<T>;
  update(update: object): Promise<T>;
}

export type ObjectId = Types.ObjectId;

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FilterQuery {
  [key: string]: any;
}

export interface UpdateQuery {
  [key: string]: any;
}

export interface PopulateOptions {
  path: string;
  select?: string;
  model?: string;
  match?: object;
  options?: object;
} 