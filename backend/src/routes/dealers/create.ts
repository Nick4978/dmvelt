import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export default async function createDealer(
  req: Request,
  res: Response
): Promise<void> {
  const { name, address, phone } = req.body;

  // Validate input
  if (!name || !address || !phone) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    // Create dealer in the database
    const newDealer = await prisma.dealer.create({
      data: {
        name,
        address,
        phone,
      },
    });

    // Respond with the created dealer
    res.status(201).json(newDealer);
  } catch (error) {
    console.error("Error creating dealer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
