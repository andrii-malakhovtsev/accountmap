import { Account } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { app } from "../lib/utils";

export type PatchAccount = Partial<Omit<Account, "id" | "userid">>;

app.patch("/accounts/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const account = await prisma.account.update({ where: { id: id }, data: body });
  if (!account) {
    res.status(404);
    return res.json({ message: "Invalid Account" });
  }
  res.status(200);
  res.json({ message: "Account updated successfully" });
});
