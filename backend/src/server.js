"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const dealers_1 = __importDefault(require("./routes/dealers"));
const liens_1 = __importDefault(require("./routes/liens"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Route groups
app.use("/auth", auth_1.default);
app.use("/users", users_1.default);
app.use("/dealers", dealers_1.default);
app.use("/liens", liens_1.default);
//app.get("/api/health", (_, res) => res.send("API is healthy ✅"));
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
