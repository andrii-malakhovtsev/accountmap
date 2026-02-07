import express from "express";
import { prisma } from "../lib/prisma";
import { get_default_user } from "../lib/utils";

const router = express.Router();

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
