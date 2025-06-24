import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const prisma = new PrismaClient();

export async function getUserFromRequest(req: Request, res: Response) {
  const token = req.cookies?.token;
  if (!token) {
    console.log("No Token Sent");
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      dealerId: number;
      role: string;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    return user
      ? { ...user, dealerId: decoded.dealerId, role: decoded.role }
      : null;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
