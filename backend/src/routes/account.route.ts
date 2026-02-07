import express from "express";
import { Account, Identity } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { get_default_user } from "../lib/utils";

const router = express.Router();

router.get("/map", async (req: any, res: any) => {
	try {
		const user = await get_default_user();
		if (!user) {
			return res.status(500).json({ error: "Default user not found" });
		}
		const accounts = await prisma.account.findMany({
			where: { userid: user.id },
			include: {
				connections: {
					select: {
						identity: true,
					},
				},
			},
		});
		res.status(200);
		return res.json(accounts);
	} catch (error) {
		console.error("Error fetching map accounts:", error);
		return res.status(500).json({ error: "An error occurred while fetching accounts." });
	}
});

// GET /:id
// Retrieves an account and its connections (linked identities)
router.get("/:id", async (req: any, res: any) => {
	const accountId = req.params.id;
	if (!accountId) return res.status(400).json({ message: "Missing account id in params" });

	try {
		const user = await get_default_user();
		if (!user) return res.status(500).json({ message: "Default user not found" });

		const account = await prisma.account.findUnique({
			where: { id: accountId },
			include: {
				connections: {
					select: {
						identity: true,
					},
				},
			},
		});
		if (!account) return res.status(404).json({ message: "Account not found" });
		if (account.userid !== user.id)
			return res.status(403).json({ message: "Account ownership mismatch" });

		return res.status(200).json(account);
	} catch (error) {
		console.error("Error in GET /accounts/:id", error);
		return res.status(500).json({ message: "Error retrieving account" });
	}
});

type PostAccounts = Omit<Account, "id" | "userid"> & {
	identities?: Omit<Identity, "id" | "userid">[];
};

async function get_or_create_identities(
	userid: string,
	identities: Omit<Identity, "id" | "userid">[] = [],
) {
	if (!identities.length) return [] as string[];

	const promises = identities.map((identity) =>
		prisma.identity.findFirst({
			where: { userid, type: identity.type, value: identity.value },
		}),
	);
	const completed = await Promise.all(promises);
	const ids: string[] = [];
	const need_creating: Omit<Identity, "id">[] = [];

	for (let i = 0; i < completed.length; i++) {
		const complete = completed[i];
		if (complete) {
			ids.push(complete.id);
			continue;
		}
		need_creating.push({ ...identities[i], userid });
	}

	if (need_creating.length) {
		const created_ids = await prisma.identity.createManyAndReturn({
			data: need_creating,
		});
		created_ids.forEach((id) => ids.push(id.id));
	}

	return ids;
}

router.post("/add", async (req: any, res: any) => {
	const body: PostAccounts = req.body;
	if (!body || typeof body.name !== "string" || body.name.trim() === "") {
		return res.status(400).json({ error: "Field 'name' is required." });
	}
	if (body.identities && !Array.isArray(body.identities)) {
		return res.status(400).json({ error: "Field 'identities' must be an array." });
	}

	try {
		const user = await get_default_user();
		if (!user) {
			return res.status(500).json({ error: "Default user not found" });
		}
		const userid = user.id;

		const existingAccount = await prisma.account.findFirst({
			where: {
				userid,
				name: body.name.trim(),
				username: body.username ?? null,
			},
		});
		if (existingAccount) {
			return res.status(409).json({
				error: "Account already exists",
				account: existingAccount,
			});
		}

		const identities = await get_or_create_identities(userid, body.identities ?? []);
		const account = await prisma.account.create({
			data: {
				name: body.name.trim(),
				username: body.username,
				categories: body.categories,
				notes: body.notes,
				userid,
			},
		});
		const connections = identities.map((identityId) => ({
			accountId: account.id,
			identityId,
		}));
		if (connections.length) {
			await prisma.connections.createMany({ data: connections });
		}

		return res.status(201).json({ message: "Account Created Successfully", account });
	} catch (error) {
		console.error("Error creating account:", error);
		return res.status(500).json({ error: "Error creating account" });
	}
});

// PATCH /:id
// Updates an account's fields (name, username, notes, categories)
router.patch("/:id", async (req: any, res: any) => {
	const accountId = req.params.id;
	const { name, username, notes, categories } = req.body || {};

	if (!accountId) return res.status(400).json({ message: "Missing account id in params" });
	if (
		name === undefined &&
		username === undefined &&
		notes === undefined &&
		categories === undefined
	)
		return res.status(400).json({ message: "Provide at least one field to update" });

	if (name !== undefined && typeof name !== "string")
		return res.status(400).json({ message: "Field name must be a string" });
	if (username !== undefined && username !== null && typeof username !== "string")
		return res.status(400).json({ message: "Field username must be a string or null" });
	if (notes !== undefined && notes !== null && typeof notes !== "string")
		return res.status(400).json({ message: "Field notes must be a string or null" });
	if (categories !== undefined && !Array.isArray(categories))
		return res.status(400).json({ message: "Field categories must be an array" });

	try {
		const user = await get_default_user();
		if (!user) return res.status(500).json({ message: "Default user not found" });

		const existing = await prisma.account.findUnique({ where: { id: accountId } });
		if (!existing) return res.status(404).json({ message: "Account not found" });
		if (existing.userid !== user.id)
			return res.status(403).json({ message: "Account ownership mismatch" });

		const updateData: Partial<Account> = {};
		if (name !== undefined) updateData.name = String(name).trim();
		if (username !== undefined)
			updateData.username = username === null ? null : String(username).trim();
		if (notes !== undefined) updateData.notes = notes === null ? null : String(notes).trim();
		if (categories !== undefined) {
			const validEnumValues = ["GOOGLE"];
			const normalized = categories
				.map((cat: any) => String(cat).toUpperCase())
				.filter((cat: string) => validEnumValues.includes(cat));
			updateData.categories = normalized as any;
		}

		const candidateName = updateData.name ?? existing.name;
		const candidateUsername =
			updateData.username !== undefined ? updateData.username : (existing.username ?? null);
		const duplicate = await prisma.account.findFirst({
			where: {
				id: { not: existing.id },
				userid: user.id,
				name: candidateName,
				username: candidateUsername,
			},
		});
		if (duplicate) return res.status(409).json({ message: "Account already exists" });

		const updated = await prisma.account.update({
			where: { id: accountId },
			data: updateData,
		});

		return res.status(200).json({
			message: "Account updated",
			id: updated.id,
			name: updated.name,
			username: updated.username,
			notes: updated.notes,
			categories: updated.categories,
			userid: updated.userid,
		});
	} catch (error) {
		console.error("Error in PATCH /accounts/:id", error);
		return res.status(500).json({ message: "Error updating account" });
	}
});

async function delete_connections(accountId: string) {
	await prisma.connections.deleteMany({ where: { accountId } });
}

// DELETE /:id
// Deletes an account and its connections
router.delete("/:id", async (req: any, res: any) => {
	const accountId = req.params.id;
	if (!accountId) return res.status(400).json({ message: "Missing account id in params" });

	try {
		const user = await get_default_user();
		if (!user) return res.status(500).json({ message: "Default user not found" });

		const existing = await prisma.account.findUnique({ where: { id: accountId } });
		if (!existing) return res.status(404).json({ message: "Account not found" });
		if (existing.userid !== user.id)
			return res.status(403).json({ message: "Account ownership mismatch" });

		await delete_connections(accountId);
		await prisma.account.delete({ where: { id: accountId } });

		return res.status(200).json({ message: "Account deleted", id: accountId });
	} catch (error) {
		console.error("Error in DELETE /accounts/:id", error);
		return res.status(500).json({ message: "Error deleting account" });
	}
});

/**
 * Middleware: Sanitizes the entire req.body array and maps each account to the Account schema.
 * Validates required/optional fields and type-checks them.
 * Adds userid to each account.
 * If valid, attaches sanitized data to req.body and calls next().
 * If invalid, responds with 400 error.
 */
async function sanitizeAccount(req: any, res: any, next: any) {
	try {
		const payload = req.body;

		// Validate payload is an array
		if (!Array.isArray(payload)) {
			return res.status(400).json({ error: "Request body must be an array of accounts" });
		}

		// Get userid
		const user = await get_default_user();
		if (!user) {
			return res.status(500).json({ error: "Default user not found" });
		}
		const userid = user.id;
		// const userid = (await get_default_user())!.id;

		// Sanitize each item in the array
		const sanitized = payload.map((item: any, index: number) => {
			// Validate item is an object
			if (!item || typeof item !== "object") {
				throw new Error(`Item at index ${index} must be an object`);
			}

			// name is REQUIRED - must be a non-empty string
			if (typeof item.name !== "string" || item.name.trim() === "") {
				throw new Error(
					`Item at index ${index}: Field "name" is required and must be a non-empty string`,
				);
			}

			// username is OPTIONAL - trim if present
			const username = item.username ? String(item.username).trim() : undefined;

			// notes is OPTIONAL - can come from "note" or "notes" field, trim if present
			const noteValue = item.note || item.notes;
			const notes = noteValue ? String(noteValue).trim() : undefined;

			// categories is OPTIONAL - must be array of valid enum values
			let categories: string[] = [];
			if (item.categories) {
				if (!Array.isArray(item.categories)) {
					throw new Error(`Item at index ${index}: Field "categories" must be an array`);
				}
				const validEnumValues = ["GOOGLE"]; // Valid Categories enum values
				categories = item.categories
					.map((cat: any) => String(cat).toUpperCase())
					.filter((cat: string) => validEnumValues.includes(cat));
			}

			// url field is intentionally dropped (not part of Account schema)

			return {
				name: item.name.trim(),
				username: username || undefined,
				notes: notes || undefined,
				categories,
				userid,
			};
		});

		// Attach sanitized data to req and proceed
		req.sanitizedBody = sanitized;
		next();
	} catch (error) {
		res.status(400).json({ error: (error as Error).message });
	}
}

router.route("/bulk").post(sanitizeAccount, async (req: any, res: any) => {
	try {
		const createMany = await prisma.account.createMany({
			data: req.sanitizedBody,
		});
		res.status(200).json({ message: `Successfully created ${createMany} users.` });
	} catch (error) {
		console.error("Error creating users:", error);
		res.status(500).json({ error: "An error occurred while creating users." });
	}
});

export default router;
