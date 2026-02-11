import express from "express"; // Ensure express is imported for hosting on Render.com
import cors from "cors";
import { prisma } from "./lib/prisma";
import { app, get_default_user } from "./lib/utils";
import routes from "./routes/index.route";

const PORT = Number(process.env.PORT) || 10000;

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.get("/", (_, res) => {
    res.json({
        message: "Welcome to the AccountMap API",
    });
});

app.use("/api", routes);

async function load_default_user() {
    const user = await get_default_user();
    if (user) return;
    await prisma.user.create({
        data: {
            email: process.env.DEFAULT_USER_EMAIL || "default@example.com",
            password: process.env.DEFAULT_USER_PASSWORD || "default",
            username: process.env.DEFAULT_USER_NAME || "default",
        },
    });
}

load_default_user().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
});

process.on("SIGTERM", () => {
    console.log("SIGTERM received. Cleaning up...");
    process.exit(0);
});