import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function updateDealer(
  req: Request,
  res: Response
): Promise<void> {
  const { id, dealer } = req.body;

  // Validate input
  if (!dealer) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    // Update dealer in the database
    const updatedDealer = await prisma.dealer.update({
      where: { id },
      data: {
        name: dealer.name,
        address: dealer.address,
        phone: dealer.phone,
      },
    });

    // Respond with the updated dealer
    res.status(200).json(updatedDealer);
  } catch (error) {
    console.error("Error updating dealer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
