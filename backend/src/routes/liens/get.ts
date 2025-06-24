import { getUserFromRequest } from "../utils/utils";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export default async function getLiens(
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

  const readParam = url.searchParams.get("readFlag");
  const filterUnread = readParam === "false"; // true when ?readFlag=false

  const status = url.searchParams.get("status");

  const readFlag = url.searchParams.get("readFlag") === "false";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "25", 10);
  const search = url.searchParams.get("search") || "";

  const dealerIdRaw = req.cookies.get("dealerId")?.value;
  const dealerId = dealerIdRaw ? Number(dealerIdRaw) : null;

  const offset = (page - 1) * limit;
  try {
    console.log("filterUnread flag is", filterUnread);
    console.log("readFlag param is", readParam);
    console.log("Dealer ID is", dealerId);
    console.log("status is", status);

    if (dealerId && !isNaN(dealerId)) {
      const [liens, total] = await Promise.all([
        prisma.lien.findMany({
          where: {
            dealerId: dealerId,
            ...(status !== null ? { status: parseInt(status) } : {}),
            ...(readParam === "true"
              ? { readFlag: true }
              : readParam === "false"
              ? { readFlag: false }
              : {}),
            ...(search
              ? {
                  vehicle: {
                    vin: {
                      contains: search, // partial match
                      mode: "insensitive", // optional, for case-insensitive search
                    },
                  },
                }
              : {}),
          },
          orderBy: { createdAt: "desc" },
          include: { vehicle: true },
          skip: offset,
          take: limit,
        }),
        prisma.lien.count({
          where: {
            dealerId: dealerId,
            ...(status !== null ? { status: parseInt(status) } : {}),
            ...(readParam === "true"
              ? { readFlag: true }
              : readParam === "false"
              ? { readFlag: false }
              : {}),
            ...(search
              ? {
                  vehicle: {
                    vin: {
                      contains: search, // partial match
                      mode: "insensitive", // optional, for case-insensitive search
                    },
                  },
                }
              : {}),
          },
        }),
      ]);

      res.json({
        liens,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } else {
      const [liens, total] = await Promise.all([
        prisma.lien.findMany({
          where: {
            ...(status !== null ? { status: parseInt(status) } : {}),
            ...(readParam === "true"
              ? { readFlag: true }
              : readParam === "false"
              ? { readFlag: false }
              : {}),
            ...(search
              ? {
                  vehicle: {
                    vin: {
                      contains: search, // partial match
                      mode: "insensitive", // optional, for case-insensitive search
                    },
                  },
                }
              : {}),
          }, // filter conditionally
          orderBy: { createdAt: "desc" },
          include: { vehicle: true },
          skip: offset,
          take: limit,
        }),
        prisma.lien.count({
          where: {
            ...(status !== null ? { status: parseInt(status) } : {}),
            ...(readParam === "true"
              ? { readFlag: true }
              : readParam === "false"
              ? { readFlag: false }
              : {}),
            ...(search
              ? {
                  vehicle: {
                    vin: {
                      contains: search, // partial match
                      mode: "insensitive", // optional, for case-insensitive search
                    },
                  },
                }
              : {}),
          }, // filter conditionally
        }),
      ]);

      res.json({
        liens,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }
  } catch (err) {
    console.error("Error in /api/liens route:", err);
    res.json({ error: "Internal Server Error" });
  }
}
