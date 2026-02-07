import { Categories, IdentityType } from "../../generated/prisma/enums";
import { app } from "../lib/utils";

app.get("/categories", (_, res) => {
  const categories = [];
  for (const category of Object.values(Categories)) {
    categories.push(category);
  }
  res.json(categories);
});

app.get("/identitytypes", (_, res) => {
  const identityTypes = [];
  for (const identityType of Object.values(IdentityType)) {
    identityTypes.push(identityType);
  }
  res.json(identityTypes);
});
