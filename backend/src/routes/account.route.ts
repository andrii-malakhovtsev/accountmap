import express from "express";
import { prisma } from "../lib/prisma";
import { get_default_user } from "../lib/utils";

const router = express.Router();

router.route("/bulk").post(async (req: any, res: any) => {
	try {
		const userid = (await get_default_user())!.id;
		const createMany = await prisma.account.createMany({
			data: { ...req.body[0], userid: userid },
		});
		res.status(200).json({ message: `Successfully created ${createMany} users.` });
	} catch (error) {
		console.error("Error creating users:", error);
		res.status(500).json({ error: "An error occurred while creating users." });
	}
});

export default router;
