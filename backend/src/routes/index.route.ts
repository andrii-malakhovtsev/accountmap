import express from "express";
import accountsRoutes from "./account.route";

const router = express.Router();

router.use("/accounts", accountsRoutes);

export default router;
