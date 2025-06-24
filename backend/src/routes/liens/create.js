"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createLien;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createLien(req, res) {
    const { lien } = req.body;
    // Validate input
    if (!lien) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        // Create lien in the database
        const newLien = await prisma.lien.create({
            data: {
                dealerId: lien.id,
                vehicleId: lien.vehicle.id,
                rank: lien.rank,
                status: lien.status,
                lienholder: lien.name,
                readFlag: lien.readFlag,
            },
        });
        res.status(201).json(newLien);
    }
    catch (error) {
        console.error("Error creating lien:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
