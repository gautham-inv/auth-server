"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const node_server_1 = require("@hono/node-server");
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const client_1 = require("@prisma/client");
const cors_1 = require("hono/cors");
require("dotenv/config");
const prisma = new client_1.PrismaClient();
const auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
});
const app = new hono_1.Hono();
app.use("/api/auth/*", (0, cors_1.cors)({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
}));
app.on(["POST", "GET"], "/api/auth/**", (c) => {
    return auth.handler(c.req.raw);
});
app.get("/", (c) => {
    return c.text("Auth Server is running!");
});
const port = 4000;
console.log(`Auth server is running on http://localhost:${port}`);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port,
});
//# sourceMappingURL=index.js.map