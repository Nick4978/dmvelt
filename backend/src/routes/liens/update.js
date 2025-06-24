"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateLien;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function updateLien(req, res) {
    const { lien } = req.body;
    // Validate input
    if (!lien.id || !lien.dealerId || !lien.vin || !lien.amount || !lien.date) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        // Update lien in the database
        const updatedLien = await prisma.lien.update({
            where: { id: lien.id },
            data: {
                dealerId: lien.dealerId,
                vehicleId: lien.vehicleId,
                rank: lien.rank,
                status: lien.status,
                lienholder: lien.name,
                readFlag: lien.readFlag,
            },
        });
        // Respond with the updated lien
        res.status(200).json(updatedLien);
    }
    catch (error) {
        console.error("Error updating lien:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
