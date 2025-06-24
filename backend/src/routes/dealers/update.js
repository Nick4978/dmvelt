"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateDealer;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function updateDealer(req, res) {
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
    }
    catch (error) {
        console.error("Error updating dealer:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
