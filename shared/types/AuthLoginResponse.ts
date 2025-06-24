import { DealerSummary } from "./";

export interface AuthLoginResponse {
  token: string;
  role: "user" | "admin";
  dealers: DealerSummary[];
}
