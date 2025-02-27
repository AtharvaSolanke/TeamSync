import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Fix `__dirname` for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve Correct Frontend Build Path
const frontendPath = path.join(__dirname, "../../frontend/dist");

if (process.env.NODE_ENV === "production") {
    console.log(`🚀 Serving frontend from: ${frontendPath}`);

    // Serve static frontend files
    app.use(express.static(frontendPath));

    // Handle all routes for SPA
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

// Start the server
server.listen(PORT, () => {
    console.log(`✅ Server is running on PORT: ${PORT}`);
    connectDB();
});
