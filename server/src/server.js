import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import recordRoutes from "./routes/record.routes.js";
import fileRoutes from "./routes/file.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, max: 120 })); // 120 req/min/ip

app.get("/", (_req, res) => res.json({ ok: true, service: "personal-vault-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`)))
  .catch((e) => {
    console.error("MongoDB connection failed:", e.message);
    process.exit(1);
  });
