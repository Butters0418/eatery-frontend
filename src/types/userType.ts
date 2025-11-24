export interface LoginInfo {
  account: string;
  password: string;
}

export type UserRole = 'admin' | 'staff';

export interface UserAccount {
  _id: string;
  account: string;
  role: UserRole;
  isLocked: boolean;
  loginFailCount: number;
  createdAt?: string;
  updatedAt?: string;
  verificationCode?: string | null;
  verificationExpires?: string | null;
}
