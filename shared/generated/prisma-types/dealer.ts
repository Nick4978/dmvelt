import { DealerUserModel, DealerUserCreateInput } from "./dealer-user";
import { LienModel, LienCreateInput } from "./lien";

export interface DealerModel {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  lienHolderId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users?: DealerUserModel[];
  liens?: LienModel[];
}

export interface DealerCreateInput {
  id?: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  lienHolderId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  users?: DealerUserCreateInput[];
  liens?: LienCreateInput[];
}

export type DealerUpdateInput = Partial<DealerCreateInput>;

