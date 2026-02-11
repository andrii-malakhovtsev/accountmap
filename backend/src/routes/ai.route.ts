import { Router } from "express";
import { prisma } from "../lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.get("/analyze", async (req, res) => {
  try {
    const user = await prisma.user.findFirst(); 
    
    if (!user) {
      return res.status(400).send("No user found in database.");
    }

    const accounts = await prisma.account.findMany({
      where: { userid: user.id },
      include: { connections: { select: { identity: true } } },
    });

    if (!accounts || accounts.length === 0) {
      return res.status(400).send("No accounts found in DB for this user.");
    }

    console.log(`Sending ${accounts.length} accounts to Gemini...`);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `
        You are a Digital Forensic Architect specializing in "Account Recovery Graphs."
        
        CONTEXT:
        This app maps how accounts (Gmail, Outlook, Phone Numbers) are used to recover other services. 
        It intentionally does NOT store passwords or MFA status. 
        Your job is to analyze the RECOVERY PATHS only.

        CRITICAL RULES:
        1. Do NOT suggest adding password fields or MFA tracking.
        2. Focus solely on "Single Points of Failure" (e.g., one Gmail recovering 10 accounts).
        3. Identify "Circular Loops" (e.g., Gmail recovers Outlook, Outlook recovers Gmail).
        4. Flag "SMS Risks" (e.g., High-value accounts relying on phone numbers).
        5. Be technical, concise, and stay under 200 words.
      `
    });

    const prompt = `
      Analyze the following user account security data for vulnerabilities:
      ${JSON.stringify(accounts)}

      Identify:
      1. Critical vulnerabilities.
      2. Suggested structural changes.

      CONSTRAINTS: 
      - Limit response to ~200 words.
      - Prioritize most dangerous risks first.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(text);

  } catch (error: any) {
    console.error("!!! GEMINI CRASHED !!!");
    console.error(error);
    return res.status(500).send(`Gemini Error: ${error.message}`);
  }
});

export default router;