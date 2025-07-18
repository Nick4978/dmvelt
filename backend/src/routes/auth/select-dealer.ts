import { Request, Response } from "express";

export default async function selectDealer(
  req: Request,
  res: Response
): Promise<void> {
  const { dealerId } = req.body();

  if (!dealerId) {
    res.status(400).json({ error: "Missing dealerId" });
  }

  // Optional: Validate dealerId belongs to this user (up to you)
  // You could decode the token from cookies and check ownership.

  res.cookie("dealerId", dealerId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 3600 * 1000, // optional: 1 hour
  });

  res.json({ message: "Dealer selected" });
}
