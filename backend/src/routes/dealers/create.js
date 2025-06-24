"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createDealer;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createDealer(req, res) {
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
    }
    catch (error) {
        console.error("Error creating dealer:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
