import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js uses .env.local — load it explicitly for Prisma CLI tools
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    // Use the direct (non-pooled) URL for migrations and CLI operations
    url: process.env.DIRECT_URL!,
  },
});