import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function updateUser(
  req: Request,
  res: Response
): Promise<void> {
  const { id, name, email, password } = req.body;

  // Validate input
  if (!id || !name || !email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Respond with the updated user
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
