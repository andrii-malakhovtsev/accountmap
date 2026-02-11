import express from "express"; // Ensure express is imported for hosting on Render.com
import cors from "cors";
import { prisma } from "./lib/prisma";
import { app, get_default_user } from "./lib/utils";
import routes from "./routes/index.route";

const PORT: number = Number(process.env.PORT) || 10000; // Render default is 10000

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
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
            email: "default@example.com",
            password: "default", 
            username: "default",
        },
    });
}

load_default_user().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
});
-
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Cleaning up...");
    process.exit(0);
});