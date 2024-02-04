import { Router } from "express";
import { Argon2id, auth, generateId } from "auth";
import { prisma as db } from "db";
import { loginSchema, signUpSchema } from "../schema/authSchema.js";
import { createUser, getUserFromEmail } from "../functions/auth/index.js";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
	const data = await loginSchema.safeParseAsync(req.body);
	if (!data.success) {
		throw new Error("Invalid data");
	}
	const { email, password } = data.data;
	const user = await getUserFromEmail(db, email);
	if (!user || !user.hashed_password) {
		throw new Error("Invalid email/password");
	}
	// TODO: use legacy password hashing instead of aargon2id
	const passwordMatches = await new Argon2id().verify(user.hashed_password, password);
	if (!passwordMatches) {
		throw new Error("Invalid email/password");
	}
	const session = await auth.createSession(user.id, {});
	const sessionCookie = auth.createSessionCookie(session.id);
	res.setHeader("Set-Cookie", sessionCookie.serialize());
	res.setHeader("Location", "/");
	res.json({
		message: "Successfully logged in",
	});
});

authRouter.get("/user", async (req, res) => {
	const sessionId = auth.readSessionCookie(req.headers.cookie ?? "");
	if (!sessionId) {
		throw new Error("Not logged in");
	}
	const { session, user } = await auth.validateSession(sessionId);
	if (session?.fresh) {
		res.appendHeader("Set-Cookie", auth.createSessionCookie(session.id).serialize());
	}
	if (!session) {
		res.appendHeader("Set-Cookie", auth.createBlankSessionCookie().serialize());
	}
	if (!user) {
		throw new Error("Not logged in");
	}
	res.json(user);
});

authRouter.post("/signup", async (req, res) => {
	const data = await signUpSchema.safeParseAsync(req.body);
	if (!data.success) {
		throw new Error("Invalid data");
	}
	const user = await getUserFromEmail(db, data.data.email);
	if (user?.id) {
		throw new Error("Email already in use");
	}
	// TODO: use legacy password hashing instead of aargon2id
	const hashed_password = await new Argon2id().hash(data.data.password);
	const id = generateId(15);
	const newUser = await createUser({
		hashed_password,
		id,
		db,
		...data.data,
	});
	if (!newUser) {
		throw new Error("Error creating user");
	}
	const session = await auth.createSession(id, {});
	const sessionCookie = auth.createSessionCookie(session.id);
	res.setHeader("Set-Cookie", sessionCookie.serialize());
	res.setHeader("Location", "/");
	res.json({
		message: "User Created",
	});
});

export default authRouter;
