import { DealerModel, DealerCreateInput } from "./dealer";
import { UserModel, UserCreateInput } from "./user";

export interface DealerUserModel {
  id: number;
  dealerId: number;
  userId: number;
  isActive: boolean;
  dealer?: DealerModel;
  user?: UserModel;
}

export interface DealerUserCreateInput {
  id?: number;
  dealerId?: number;
  userId?: number;
  isActive?: boolean;
  dealer?: DealerCreateInput;
  user?: UserCreateInput;
}

export type DealerUserUpdateInput = Partial<DealerUserCreateInput>;

