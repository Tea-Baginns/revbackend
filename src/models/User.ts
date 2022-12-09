import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

export type IUser = {
  name: string;
  email: string;
  password: string;
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
  },
  {
    timestamps: true,
  },
);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
