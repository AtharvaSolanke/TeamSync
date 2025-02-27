import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import { app, server } from "./lib/socket.js";

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

// check enviornment for production or deployment
if (process.env.NODE_ENV === "production") {
    // serve static frontend files
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // handle all routes for single page application
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

// start the server
server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});