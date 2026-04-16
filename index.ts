import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { cors } from "hono/cors";
import "dotenv/config";

const prisma = new PrismaClient();

const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: corsOrigins,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});

const app = new Hono();

app.use(
  "/api/auth",
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

app.use(
  "/api/auth/*",
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

const authHandler = (c: any) => auth.handler(c.req.raw);

app.on(["POST", "GET", "OPTIONS"], "/api/auth", authHandler);
app.on(["POST", "GET", "OPTIONS"], "/api/auth/*", authHandler);

app.get("/", (c) => {
  return c.text("Auth Server is running!");
});

const port = Number(process.env.PORT ?? "4000");
console.log(`Auth server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
