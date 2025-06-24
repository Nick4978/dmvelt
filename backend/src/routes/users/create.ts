import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function createUser(
  req: Request,
  res: Response
): Promise<void> {
  const { user } = req.body;

  // Validate input
  if (!user) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    // Create user in the database
    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
      },
    });

    // Respond with the created user
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
