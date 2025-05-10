import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password: string;
  phoneNumber: string;
  company?: any;
  role: string;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  subscription?: any;
  profile?: any;
  settings?: any;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String, required: true, unique: true },
    company: { type: Schema.Types.Mixed },
    role: { type: String, default: 'utilisateur', enum: ['utilisateur', 'admin', 'etudiant', 'recruteur'] },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    subscription: { type: Schema.Types.Mixed },
    profile: { type: Schema.Types.Mixed },
    settings: {
      type: Object,
      default: {
        notifications: true,
        newsletter: true,
        language: 'fr',
        theme: 'light',
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema); 