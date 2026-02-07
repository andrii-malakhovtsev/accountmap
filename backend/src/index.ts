// Bring in required modules and libraries
import express, { json } from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import { PostAccounts } from "./input_types";
import { Identity } from "../generated/prisma/client";

const DEFAULT_USER = "default";
const app = express();
const PORT = process.env.PORT || 8081;

// Middleware

// Middleware functions are functions that have access to the request object (req),
// the response object (res), and the next middleware function in the application’s request-response cycle.
// Here, we are using CORS to allow cross-origin requests and express.json() to parse JSON request bodies.
// In simple terms its a kind of "gatekeeper" that processes incoming requests before they reach our route handlers.
app.use(cors());
app.use(json());

// Routes

// Basic route to check if the server is running and to provide API documentation
app.get("/", (_, res) => {
  res.json({
    message: "Welcome to the Full-Stack Demo API",
  });
});

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
    console.log("Sad")
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
  res.json({message:"Account Created Successfully"})
});

async function get_default_user() {
  return await prisma.user.findUnique({ where: { username: "default" } });
}

async function load_default_user() {
  const user = await get_default_user();
  if (user) return;
  await prisma.user.create({
    data: {
      email: "default@example.com",
      password: "default",
      username: "default",
    },
  });
}

load_default_user().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Graceful shutdown - this is important for closing database connections when the server is stopped
// We always want to ensure that we close our database connections when the server is shutting down
// so we don't have any "orphaned" connections left open, that could be dangerous to a apps security and performance.
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing connections...");
  await prisma.$disconnect();
  process.exit(0);
});
