import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export default async function check(
  req: Request,
  res: Response
): Promise<void> {
  // Parse cookies from the request headers

  const token = req.cookies?.token;

  if (!token) {
    console.log(`Invalid Token: ${token}`);
    res.status(200).json({ loggedIn: false });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecret"
    ) as any;

    res.status(200).json({
      loggedIn: true,
      userId: decoded?.userId,
      name: decoded?.name || null,
      role: decoded?.role || null,
      dealerId: decoded?.dealerId || null,
    });
    console.log(`User ${decoded?.userId} logged in successfully`);
  } catch (err) {
    console.log("ERROR: " + err);
    res.status(200).json({ loggedIn: false });
  }
}
