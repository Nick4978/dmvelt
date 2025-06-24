"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = logout;
async function logout(req, res) {
    // Clear the token cookie to log out the user
    res.clearCookie("dealerId", { httpOnly: true, path: "/" });
    res.clearCookie("token", { httpOnly: true, path: "/" });
    res.json({ message: "Logged out" });
}
