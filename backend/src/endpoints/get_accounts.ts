import { prisma } from "../lib/prisma";
import { app, get_default_user } from "../lib/utils";

app.get("/map", async (req, res) => {
  const user = (await get_default_user())!;
  const accounts = await prisma.account.findMany({
    where: { userid: user.id },
    include: {
      connections: {
        select: {
          identity: true,
        },
      },
    },
  });
  res.status(200);
  return res.json(accounts);
});
