import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { env } from "@/env.js";
import { db } from "@/server/db";
import { sessions, users, type User as DbUser } from "@/server/db/schema";
// Uncomment the following lines if you are using nodejs 18 or lower. Not required in Node.js 20, CloudFlare Workers, Deno, Bun, and Vercel Edge Functions.
// import { webcrypto } from "node:crypto";
// globalThis.crypto = webcrypto as Crypto;

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  getSessionAttributes: (attributes) => {
    return {
      isUserVerified: attributes.isUserVerified,
      organization: attributes.organization,
    };
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      emailVerified: attributes.emailVerified,
      avatar: attributes.avatar,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
    };
  },

  sessionExpiresIn: new TimeSpan(4, "w"),
  sessionCookie: {
    name: "session",

    expires: false, // session cookies have very long lifespan (2 years)
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
    // DatabaseOrganizationAttributes: DatabaseOrganizationAttributes;
  }
}

interface DatabaseSessionAttributes {
  isUserVerified: boolean;
  organization?: string;
}
interface DatabaseUserAttributes extends Omit<DbUser, "hashedPassword"> {}
// interface Organization {
//   id: string;
//   name: string;
//   createdBy: string;
// }
// interface DatabaseOrganizationAttributes {
//   organizations: Organization[];
// }
