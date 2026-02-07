import express from "express";
import accountsRoutes from "./account.route";
import connectionsRoutes from "./connection.route";

const router = express.Router();

router.use("/accounts", accountsRoutes);
router.use("/connections", connectionsRoutes);

export default router;
