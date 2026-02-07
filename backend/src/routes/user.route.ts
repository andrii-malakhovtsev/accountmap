import { Router } from "express";
import { get_default_user } from "../lib/utils";

const router = Router();

router.get("/default", async (_, res) => {
  const user = await get_default_user();
  if (!user) return res.status(404).json({ message: "Default user not found" });
  res.status(200).json(user);
});

export default router;
