import { Categories, IdentityType } from "../../generated/prisma/enums";
import { prisma } from "./prisma";
import { get_default_user } from "./utils";

const ACCOUNT_NAMES = [
  "GOOGLE",
  "GITHUB",
  "NETFLIX",
  "SPOTIFY",
  "AMAZON",
  "DISCORD",
  "PAYPAL",
  "CHASE",
  "DROPBOX",
  "NOTION",
];

const NOTES = [
  "2FA enabled",
  "Shared account",
  "Primary login",
  "Work account",
  "Old credentials",
  "Personal use",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset<T>(arr: T[]): T[] {
  return arr.filter(() => Math.random() > 0.1);
}

export async function createMockData() {
  const user = (await get_default_user())!;

  // Ensure identities exist (idempotent)
  const identities = await prisma.identity.findMany({
    where: { userid: user.id },
  });

  if (identities.length > 0) return;

  if (identities.length === 0) {
    await prisma.identity.createMany({
      data: [
        {
          value: user.email,
          type: IdentityType.MAIL,
          userid: user.id,
        },
        {
          value: "+15551234567",
          type: IdentityType.PHONE,
          userid: user.id,
        },
        {
          value: "auth-token-default",
          type: IdentityType.AUTH,
          userid: user.id,
        },
      ],
    });
  }

  const identityRows = await prisma.identity.findMany({
    where: { userid: user.id },
  });

  // Create accounts + connections
  for (let i = 0; i < 8; i++) {
    const account = await prisma.account.create({
      data: {
        name: randomItem(ACCOUNT_NAMES),
        username: `${user.username}_${i}`,
        notes: randomItem(NOTES),
        categories: [Categories.GOOGLE],
        userid: user.id,
      },
    });

    const connected = randomSubset(identityRows);
    for (const identity of connected) {
      await prisma.connections.create({
        data: {
          accountId: account.id,
          identityId: identity.id,
        },
      });
    }
  }
}
