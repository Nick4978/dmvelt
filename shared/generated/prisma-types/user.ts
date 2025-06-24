import { DealerUserModel, DealerUserCreateInput } from "./dealer-user";
import { PasswordTokenModel, PasswordTokenCreateInput } from "./password-token";

export interface UserModel {
  id: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  name: string;
  password: string | null;
  isLocalAdmin: boolean;
  isGlobalAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  users?: DealerUserModel[];
  passwordTokens?: PasswordTokenModel[];
}

export interface UserCreateInput {
  id?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email: string;
  name?: string;
  password?: string | null;
  isLocalAdmin?: boolean;
  isGlobalAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  users?: DealerUserCreateInput[];
  passwordTokens?: PasswordTokenCreateInput[];
}

export type UserUpdateInput = Partial<UserCreateInput>;

