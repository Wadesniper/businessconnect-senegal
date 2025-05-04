import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { UserPayload } from './user';

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
}

export interface ApiError {
  field: string;
  message: string;
  location?: string;
}

export interface ApiSuccessResponse<T> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse extends ApiResponse<never> {
  success: false;
  message: string;
  errors?: ApiError[];
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaseDocument {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterQuery<T> {
  [key: string]: any;
}

export interface BaseService<T extends BaseDocument> {
  create(data: Partial<Omit<T, keyof BaseDocument>>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findMany(filter: FilterQuery<T>, options?: PaginationOptions): Promise<T[]>;
  update(id: string, data: Partial<Omit<T, keyof BaseDocument>>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface BaseController {
  create(req: AuthenticatedRequest, res: Response): Promise<Response>;
  findById(req: AuthenticatedRequest, res: Response): Promise<Response>;
  update(req: AuthenticatedRequest, res: Response): Promise<Response>;
  delete(req: AuthenticatedRequest, res: Response): Promise<Response>;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export type RequestHandler<T = any> = (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<T>>
) => Promise<Response | void>;

export interface NotificationOptions {
  isRead?: boolean;
  offset?: number;
  limit?: number;
} 