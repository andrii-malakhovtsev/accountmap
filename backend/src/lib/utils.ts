import { prisma } from "./prisma";
import express from "express";

export async function get_default_user() {
  return await prisma.user.findUnique({ where: { username: "default" } });
}

export const app = express();
