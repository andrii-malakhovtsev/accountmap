import express from "express";
import { Categories, IdentityType } from '@prisma/client';

const router = express.Router();

router.get("/categories", (_req, res) => {
	const categories = Object.values(Categories);
	return res.status(200).json(categories);
});

router.get("/identitytypes", (_req, res) => {
	const identityTypes = Object.values(IdentityType);
	return res.status(200).json(identityTypes);
});

export default router;
