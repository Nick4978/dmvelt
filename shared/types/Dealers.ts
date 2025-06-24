import { DealerUser, Lien } from ".";

export interface Dealers {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  lienHolderId: string;
  isActive: Boolean;
  users: DealerUser[];
  liens: Lien[];
}
