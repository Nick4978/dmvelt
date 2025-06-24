import { fa } from "@faker-js/faker/.";
import { Request, Response } from "express";

export default async function logout(
  req: Request,
  res: Response
): Promise<void> {
  // Clear the token cookie to log out the user
  res.clearCookie("dealerId", { httpOnly: false, path: "/" });
  res.clearCookie("token", { httpOnly: false, path: "/" });
  res.json({ message: "Logged out" });
}
