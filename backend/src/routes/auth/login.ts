import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthLoginRequest } from "../../../../shared/types/";
import { AuthLoginResponse } from "../../../../shared/types/";
import { DealerSummary } from "../../../../shared/types/";

const prisma = new PrismaClient();

console.log("Starting login:");

export default async function login(
  req: Request,
  res: Response
): Promise<void> {
  const { email, password }: AuthLoginRequest = req.body;

  const roleCheck = await prisma.user.findUnique({
    where: { email },
  });

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      users: {
        where: { isActive: true },
        include: { dealer: true },
      },
    },
  });

  if (!user || !user.password) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const dealers: DealerSummary[] = user.users
    .filter((du) => du.isActive && du.dealer) // make sure .dealer is included in your query
    .map((du) => ({
      id: du.dealer.id,
      name: du.dealer.name,
      state: du.dealer.state,
    }));

  const role = roleCheck?.isGlobalAdmin ? "admin" : "user"; // Customize based on your data model
  console.log("User role is", role);
  const token = jwt.sign(
    {
      userId: user.id,
      name: user.name || null,
      dealerId: user.users,
      role,
    },
    process.env.JWT_SECRET || "supersecret",
    { expiresIn: "1h" }
  );

  console.log("Returning token, role, dealers:", { token, role, dealers });
  console.log("User object:", user);

  const response: AuthLoginResponse = {
    token,
    role: user.isGlobalAdmin ? "admin" : "user",
    dealers,
  };

  res.setHeader("Content-Type", "application/json");
  console.log("Setting cookie with token:", token);
  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      path: "/",
    })
    .json({ role });
}
