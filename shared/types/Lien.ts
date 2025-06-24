import { Dealers, Vehicle } from "./";

export interface Lien {
  id: number;
  dealerId: number;
  vehicleId: number;
  rank: number;
  status: number;
  lienholder: string;
  createdAt: string;
  updatedAt: string;
  readFlag: boolean;
  dealer?: Dealers;
  vehicle?: Vehicle;
}
