"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getDealers;
const client_1 = require("@prisma/client");
const utils_1 = require("../utils/utils");
async function getDealers(req, res) {
    const user = await (0, utils_1.getUserFromRequest)(req, res);
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const prisma = new client_1.PrismaClient();
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
    }
    catch (err) {
        console.error("Error in /api/dealers route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
