import { DealerUser } from "./";

export interface Users {
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
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  users: DealerUser[];
}
