"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createUser;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function createUser(req, res) {
    const { user } = req.body;
    // Validate input
    if (!user) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        // Create user in the database
        const newUser = await prisma.user.create({
            data: {
                email: user.email,
                password: await bcrypt_1.default.hash(user.password, 10),
            },
        });
        // Respond with the created user
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
