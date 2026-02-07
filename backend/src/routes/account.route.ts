import express from "express";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.route("/bulk").post(async (req: any, res: any) => {
	try {
		const createMany = await prisma.account.createMany({
			data: req.body,
		});
		res.status(200).json({ message: `Successfully created ${createMany} users.` });
	} catch (error) {
		console.error("Error creating users:", error);
		res.status(500).json({ error: "An error occurred while creating users." });
	}
});

export default router;
