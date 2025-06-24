"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromRequest = getUserFromRequest;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const prisma = new client_1.PrismaClient();
async function getUserFromRequest(req, res) {
    const token = req.cookies.token;
    if (!token)
        return null;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        return user
            ? { ...user, dealerId: decoded.dealerId, role: decoded.role }
            : null;
    }
    catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
}
