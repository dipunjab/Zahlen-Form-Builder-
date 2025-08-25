import { HydratedDocument, Schema, model, models } from 'mongoose';
import type { User } from '@/types/user';

export type IUserDoc = HydratedDocument<User>;

const UserSchema = new Schema<IUserDoc>(
  {
    username: {
      type: String,
      default: null,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      default: null,
    },

    avatarUrl: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: ['credentials', 'google', 'linkedin'],
      required: true,
      default: 'credentials',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    formCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, 
  }
);

const UserModel = models.User || model<IUserDoc>('User', UserSchema);
export default UserModel;
