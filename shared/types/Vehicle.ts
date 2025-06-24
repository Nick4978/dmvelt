import { Lien } from "./";

export interface Vehicle {
  id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  createdAt: string;
  updatedAt: string;
  liens?: Lien[];
}
