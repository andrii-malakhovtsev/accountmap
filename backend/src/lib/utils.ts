import { prisma } from "./prisma";
import express, { json } from "express";
import cors from "cors";

export async function get_default_user() {
  return await prisma.user.findUnique({ where: { username: "default" } });
}

export const app = express();
app.use(cors());
app.use(json());
