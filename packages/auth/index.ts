import { Lucia, generateId, User, Session } from "lucia";
import { TimeSpan } from "oslo";
import * as db from "db";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

const adapter = new PrismaAdapter(db.prisma.authSession, db.prisma.authUser);

export const auth = new Lucia(adapter, {
  sessionCookie: {
    name: "session",
    // expires: false,
    attributes: {
      domain:
        process.env.SERVER_DEPLOY_URL ?? process.env.DOMAIN ?? "localhost",
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  sessionExpiresIn: new TimeSpan(3, "d"), // no more active/idle
  getUserAttributes: (databaseUserAttributes) => {
    return {
      email: databaseUserAttributes.email,
      name: databaseUserAttributes.name,
      profile_image_url: databaseUserAttributes.profile_image_url,
      roles: databaseUserAttributes.roles,
      phone_number: databaseUserAttributes.phone_number,
    };
  },
});

export * from "oslo";
export * from "oslo/password";
export * from "oslo/cookie";
export * from "oslo/crypto";
export * from "oslo/encoding";
export * from "oslo/password";
export * from "oslo/request";
export { generateId, type User, type Session };

declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  profile_image_url: string;
  name: string;
  roles: string[];
  phone_number: string;
}
