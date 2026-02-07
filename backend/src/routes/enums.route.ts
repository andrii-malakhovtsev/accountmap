import express from "express";
import { Categories, IdentityType } from "../../generated/prisma/enums";

const router = express.Router();

// GET /categories
// Returns all category enum values
router.get("/categories", (_req, res) => {
	const categories = Object.values(Categories);
	return res.status(200).json(categories);
});

// GET /identitytypes
// Returns all identity type enum values
router.get("/identitytypes", (_req, res) => {
	const identityTypes = Object.values(IdentityType);
	return res.status(200).json(identityTypes);
});

export default router;
