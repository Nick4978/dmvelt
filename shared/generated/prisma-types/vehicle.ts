import { LienModel, LienCreateInput } from "./lien";

export interface VehicleModel {
  id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  createdAt: string;
  updatedAt: string;
  liens?: LienModel[];
}

export interface VehicleCreateInput {
  id?: number;
  vin: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  mileage?: number;
  createdAt?: string;
  updatedAt?: string;
  liens?: LienCreateInput[];
}

export type VehicleUpdateInput = Partial<VehicleCreateInput>;

