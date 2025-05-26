import { Schema, model } from 'mongoose';

export interface IMarketplaceItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  seller: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  reports: number;
}

const marketplaceItemSchema = new Schema<IMarketplaceItem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  seller: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  images: [{ type: String }],
  reports: { type: Number, default: 0 },
}, { timestamps: true });

export const MarketplaceItem = model<IMarketplaceItem>('MarketplaceItem', marketplaceItemSchema); 