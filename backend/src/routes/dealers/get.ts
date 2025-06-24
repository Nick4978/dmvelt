import { PrismaClient } from "@prisma/client";
import { getUserFromRequest } from "../utils/utils";
import { Request, Response } from "express";

export default async function getDealers(
  req: Request,
  res: Response
): Promise<void> {
  const user = await getUserFromRequest(req, res);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const prisma = new PrismaClient();

  const url = new URL(req.url);

  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "25", 10);
  const search = url.searchParams.get("search") || "";

  const offset = (page - 1) * limit;
  try {
    const [dealers, total] = await Promise.all([
      prisma.dealer.findMany({
        where: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.dealer.count({
        where: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }),
    ]);

    res.json({
      dealers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error in /api/dealers route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
