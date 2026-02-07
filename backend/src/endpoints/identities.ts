import { Identity } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { app, get_default_user } from "../lib/utils";

app.get("/identities", async (req, res) => {
  const user = (await get_default_user())!;
  const accounts = await prisma.identity.findMany({
    where: { userid: user.id },
    omit: { userid: true },
  });
  res.status(200);
  return res.json(accounts);
});

app.delete("/identities/:id", async (req, res) => {
  const id = req.params.id;

  await delete_connections(id);
  const identity = await prisma.identity.delete({ where: { id: id } });
  if (!identity) {
    res.status(404);
    return res.json({ message: "Invalid Identity" });
  }
  res.status(200);
  res.json({ message: "Identity deleted successfully" });
});

async function delete_connections(identityId: string) {
  await prisma.connections.deleteMany({ where: { identityId } });
}

export type PatchIdentity = Partial<Omit<Identity, "userid" | "id">>;

app.patch("/identities/:id", async (req, res) => {
  const id = req.params.id;
  const body: PatchIdentity = req.body;
  const identity = await prisma.identity.update({ where: { id }, data: body });
  if (!identity) {
    res.status(404);
    return res.json({ message: "Invalid Identity" });
  }
  res.status(200);
  res.json({ message: "Identity updated successfully" });
});

export type PostIdentity = Omit<Identity, "userid">;

app.post("/identities", async (req, res) => {
  const userid = (await get_default_user())!.id;
  const body: PostIdentity = req.body;

  const prev = await prisma.identity.findFirst({
    where: { userid, value: body.value, type: body.type },
  });
  if (prev) {
    res.status(404);
    return res.json({ id: prev.id, message: "Already Exists" });
  }
  await prisma.identity.create({
    data: {
      type: body.type,
      value: body.value,
      userid: userid,
    },
  });
  res.status(200);
  res.json({ message: "Identity created successfully" });
});
