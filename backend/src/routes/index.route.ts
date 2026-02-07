import express from "express";
import accountsRoutes from "./account.route";
import connectionsRoutes from "./connection.route";
import identitiesRoutes from "./identity.route";

const router = express.Router();

router.use("/accounts", accountsRoutes);
router.use("/connections", connectionsRoutes);
router.use("/identities", identitiesRoutes);
export default router;
