import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth/index";
import userRoutes from "./routes/users";
import dealerRoutes from "./routes/dealers";
import lienRoutes from "./routes/liens";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN, // or use process.env.FRONTEND_ORIGIN
    credentials: true, // ✅ critical
  })
);

app.use(express.json());
app.use(cookieParser());

// Route groups
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/dealers", dealerRoutes);
app.use("/liens", lienRoutes);

//app.get("/api/health", (_, res) => res.send("API is healthy ✅"));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
