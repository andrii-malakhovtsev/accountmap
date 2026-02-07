import { prisma } from "../lib/prisma";
import { app } from "../lib/utils";

app.delete("/accounts/:id", async (req, res) => {
  const id = req.params.id;

  await delete_connections(id);
  const account = await prisma.account.delete({ where: { id: id } });
  if (!account) {
    res.status(404);
    return res.json({ message: "Invalid Account" });
  }
  res.status(200);
  res.json({ message: "Account deleted successfully" });
});

async function delete_connections(accountId: string) {
  await prisma.connections.deleteMany({ where: { accountId } });
}
