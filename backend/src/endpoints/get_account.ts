import { prisma } from "../lib/prisma";
import { app } from "../lib/utils";

app.get("/accounts/:id", async (req, res) => {
  const accountid = req.params.id;
  const account = await prisma.account.findUnique({
    where: { id: accountid },
    include: {
      connections: {
        select: {
          identity: true,
        },
      },
    },
  });
  if (!account) {
    res.status(404);
    return res.json("Account not found");
  }
  res.status(200);
  return res.json(account);
});
