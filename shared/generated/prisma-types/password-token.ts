import { UserModel, UserCreateInput } from "./user";

export interface PasswordTokenModel {
  id: number;
  token: string;
  userId: number;
  user?: UserModel;
  expiresAt: string;
  type: string;
}

export interface PasswordTokenCreateInput {
  id?: number;
  token: string;
  userId?: number;
  user?: UserCreateInput;
  expiresAt: string;
  type: string;
}

export type PasswordTokenUpdateInput = Partial<PasswordTokenCreateInput>;

