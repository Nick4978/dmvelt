"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = login;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
async function login(req, res) {
    const { email, password } = req.body;
    const roleCheck = await prisma.user.findUnique({
        where: { email },
    });
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            users: {
                where: { isActive: true },
                include: { dealer: true },
            },
        },
    });
    if (!user || !user.password) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
    }
    const dealers = user.users.map((du) => ({
        id: du.dealer.id,
        name: du.dealer.name,
        state: du.dealer.state,
    }));
    const role = roleCheck?.isGlobalAdmin ? "admin" : "user"; // Customize based on your data model
    console.log("User role is", role);
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        name: user.name || null,
        dealerId: user.users,
        role,
    }, process.env.JWT_SECRET || "supersecret", { expiresIn: "1h" });
    res
        .cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000,
        path: "/",
    })
        .json({ token, role, dealers });
}
