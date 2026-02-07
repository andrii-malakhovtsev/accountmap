import { Identity } from "../../generated/prisma/client";
import { PostAccounts } from "../input_types";
import { prisma } from "../lib/prisma";
import { app, get_default_user } from "../lib/utils";

async function get_or_create_identities(
  userid: string,
  identities: Omit<Identity, "id">[],
) {
  const promises = [];
  for (const identity of identities) {
    promises.push(
      prisma.identity.findFirst({
        where: { userid, type: identity.type, value: identity.value },
      }),
    );
  }
  const completed = await Promise.all(promises);
  const ids = [];
  const need_creating = [];
  for (let i = 0; i < completed.length; i++) {
    const complete = completed[i];
    if (complete) {
      ids.push(complete.id);
      continue;
    }
    identities[i].userid = userid;
    need_creating.push(identities[i]);
  }
  const created_ids = await prisma.identity.createManyAndReturn({
    data: need_creating,
  });
  created_ids.forEach((id) => ids.push(id.id));
  return ids;
}

app.post("/api/accounts", async (req, res) => {
  let body: PostAccounts = req.body;
  const userid = (await get_default_user())!.id;
  try {
    const identities = await get_or_create_identities(
      userid,
      body.identities as any,
    );
    const account = await prisma.account.create({
      data: {
        name: body.name,
        username: body.username,
        categories: body.categories,
        notes: body.notes,
        userid: userid,
      },
    });
    const connections = identities.map((i) => {
      return {
        accountId: account.id,
        identityId: i,
      };
    });
    await prisma.connections.createMany({ data: connections });
  } catch (error) {
    res.status(404);
    res.json({ message: "Error creating account" });
    return;
  }
  res.status(201);
  res.json({ message: "Account Created Successfully" });
});
