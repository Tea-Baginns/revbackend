import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

import { Roles } from '~/types';

export type IUser = {
  name: string;
  email: string;
  password: string;
  role: Roles;
} & Document;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'reader', 'writer'],
      default: 'reader',
    },
  },
  {
    timestamps: true,
  },
);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
