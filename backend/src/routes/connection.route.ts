import express from "express";
import { prisma } from "../lib/prisma";
import { get_default_user } from "../lib/utils";

const router = express.Router();

// POST /add/:accountId
// Accepts body: { identity: { id } }
// Joins an existing identity to an account (identity must already exist)
router.post("/add/:accountId", async (req: any, res: any) => {
	const accountId = req.params.accountId;
	const identityId = req.body?.identity?.id;

	if (!accountId) return res.status(400).json({ message: "Missing accountId in params" });
	if (!identityId) return res.status(400).json({ message: "Missing identity.id in request body" });

	try {
		const user = await get_default_user();
		if (!user) return res.status(500).json({ message: "Default user not found" });

		// Ensure account exists and belongs to the default user
		const account = await prisma.account.findUnique({ where: { id: accountId } });
		if (!account) return res.status(404).json({ message: "Account not found" });
		if (account.userid !== user.id)
			return res.status(403).json({ message: "Account ownership mismatch" });

		// Ensure identity exists and belongs to the default user
		const identity = await prisma.identity.findUnique({ where: { id: identityId } });
		if (!identity) return res.status(404).json({ message: "Identity not found" });
		if (identity.userid !== user.id)
			return res.status(403).json({ message: "Identity ownership mismatch" });

		// Create connection (handle duplicate)
		try {
			await prisma.connections.create({ data: { accountId: account.id, identityId: identity.id } });
		} catch (err: any) {
			if (err?.code === "P2002")
				return res.status(409).json({ message: "Connection already exists" });
			throw err;
		}

		return res
			.status(201)
			.json({ message: "Connection added", accountId: account.id, identityId: identity.id });
	} catch (error) {
		console.error("Error in /connections/add/:accountId", error);
		return res.status(500).json({ message: "Error creating connection" });
	}
});

// POST /remove/:accountId
// Accepts body: { identity: { id } }
// Removes an existing identity from an account
router.post("/remove/:accountId", async (req: any, res: any) => {
	const accountId = req.params.accountId;
	const identityId = req.body?.identity?.id;

	if (!accountId) return res.status(400).json({ message: "Missing accountId in params" });
	if (!identityId) return res.status(400).json({ message: "Missing identity.id in request body" });

	try {
		const user = await get_default_user();
		if (!user) return res.status(500).json({ message: "Default user not found" });

		// Ensure account exists and belongs to the default user
		const account = await prisma.account.findUnique({ where: { id: accountId } });
		if (!account) return res.status(404).json({ message: "Account not found" });
		if (account.userid !== user.id)
			return res.status(403).json({ message: "Account ownership mismatch" });

		// Ensure identity exists and belongs to the default user
		const identity = await prisma.identity.findUnique({ where: { id: identityId } });
		if (!identity) return res.status(404).json({ message: "Identity not found" });
		if (identity.userid !== user.id)
			return res.status(403).json({ message: "Identity ownership mismatch" });

		const removed = await prisma.connections.deleteMany({
			where: { accountId: account.id, identityId: identity.id },
		});
		if (removed.count === 0)
			return res.status(404).json({ message: "Connection not found" });

		return res
			.status(200)
			.json({ message: "Connection removed", accountId: account.id, identityId: identity.id });
	} catch (error) {
		console.error("Error in /connections/remove/:accountId", error);
		return res.status(500).json({ message: "Error removing connection" });
	}
});

export default router;
