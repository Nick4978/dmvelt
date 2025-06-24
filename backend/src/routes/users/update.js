"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateUser;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function updateUser(req, res) {
    const { id, name, email, password } = req.body;
    // Validate input
    if (!id || !name || !email || !password) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        // Hash the new password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
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
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
