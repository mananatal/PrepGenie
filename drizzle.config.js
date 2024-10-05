/** @type { import("drizzle-kit").Config } */

export default {
    schema: "./src/utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL,
    }
  };

// import { defineConfig } from "drizzle-kit";
// export default defineConfig({
//   dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
//   schema: "./src/utils/schema.js",
//   out: "./drizzle",
//   dbCredentials: {
//     url: process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL,
//   }
// });
