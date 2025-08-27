export type AuthProvider = 'credentials' | 'google';

export interface User {
  _id?: string;             // MongoDB ObjectId as string
  username?: string | null;
  email: string;
  passwordHash?: string | null; // only for credentials users
  avatarUrl?: string | null;
  provider: AuthProvider;
  isVerified: boolean;      // true for OAuth users, false until verified for credentials
  verificationCode?: string | null;
  verificationCodeExpiry?: Date | null;  
  formCount?: number;       // simple counter (optional)
  createdAt?: Date;
  updatedAt?: Date;
}
