import { DealerModel, DealerCreateInput } from "./dealer";
import { VehicleModel, VehicleCreateInput } from "./vehicle";

export interface LienModel {
  id: number;
  dealerId: number;
  vehicleId: number;
  rank: number;
  status: number;
  lienholder: string;
  createdAt: string;
  updatedAt: string;
  readFlag: boolean;
  dealer?: DealerModel;
  vehicle?: VehicleModel;
}

export interface LienCreateInput {
  id?: number;
  dealerId?: number;
  vehicleId?: number;
  rank?: number;
  status?: number;
  lienholder?: string;
  createdAt?: string;
  updatedAt?: string;
  readFlag?: boolean;
  dealer?: DealerCreateInput;
  vehicle?: VehicleCreateInput;
}

export type LienUpdateInput = Partial<LienCreateInput>;

