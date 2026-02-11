import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../lib/prisma";
import { get_default_user } from "../lib/utils";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.get("/analyze", async (_req: any, res: any) => {
    try {
        const user = await get_default_user();
        if (!user) return res.status(500).send("Default user not found");

        const accounts = await prisma.account.findMany({
            where: { userid: user.id },
            include: { connections: { select: { identity: true } } },
        });

        if (!accounts || accounts.length === 0) {
            return res.status(400).send("No accounts found in DB for this user.");
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", 
            systemInstruction: `
                You are a Digital Forensic Architect specializing in "Account Recovery Graphs."
                Focus solely on "Single Points of Failure", "Circular Loops", and "SMS Risks".
                Be technical, concise, and stay under 100 words.
            `,
        });

        const prompt = `
            Analyze the following user account security data for vulnerabilities:
            ${JSON.stringify(accounts)}
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.setHeader("Content-Type", "text/plain");
        return res.status(200).send(text);

    } catch (error: any) {
        if (error.status === 429 || error.message?.includes("429") || error.message?.includes("quota")) {
            console.warn("⚠️ Gemini API: Out of tokens/Quota exceeded.");
            res.status(429);
            return res.send("AI is currently exhausted (Out of Tokens). Please try again in a minute.");
        }
		
        console.error("!!! GEMINI CRASHED !!!");
        console.error("Full Error:", error); 

        res.status(500);
        return res.send("AI Analysis failed. Our digital architect is currently over capacity or encountered a processing error.");
    }
});

export default router;