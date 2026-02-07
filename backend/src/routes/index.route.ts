import express from "express";
import aiRoutes from "./ai.route";
import accountsRoutes from "./account.route";
import connectionsRoutes from "./connection.route";
import enumsRoutes from "./enums.route";
import identitiesRoutes from "./identity.route";
import usersRoutes from "./user.route";

const router = express.Router();

router.use("/accounts", accountsRoutes);
router.use("/ai", aiRoutes);
router.use("/connections", connectionsRoutes);
router.use("/enums", enumsRoutes);
router.use("/identities", identitiesRoutes);
router.use("/users", usersRoutes);
export default router;
