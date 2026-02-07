import { Account, Identity } from "../generated/prisma/client";

export type PostAccounts = Omit<Account, "id" | "userid"> & {
  identities: Omit<Identity, "id" | "userid">[];
};
