import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import * as db from "db";
import * as auth from "auth";

// created for each request
export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
	const sessionId = auth.auth.readSessionCookie(req.headers.cookies?.toString() ?? "");
	if (!sessionId) {
		return { db: db.prisma, req, res };
	}
	const { session, user } = await auth.auth.validateSession(sessionId);
	if (session?.fresh) {
		res.appendHeader("Set-Cookie", auth.auth.createSessionCookie(session.id).serialize());
		res.locals.user = user;
		return {
			db: db.prisma,
			req,
			res,
		};
	}
	if (!session) {
		const sessionCookie = auth.auth.createBlankSessionCookie();
		res.appendHeader("Set-Cookie", sessionCookie.serialize());
		res.locals.user = null;
		return { db: db.prisma, req, res };
	}
	return { db: db.prisma, req, res };
};
