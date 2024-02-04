import { TRPCError } from "@trpc/server";
import { t } from "../trpc";

// Middleware
export const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.res.locals.user) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
		});
	}
	const user = ctx.res.locals.user;
	return next({
		ctx: {
			// Infers the user as non-nullable
			db: ctx.db,
			req: ctx.req,
			res: {
				...ctx.res,
				locals: {
					user,
				},
			},
		},
	});
});
