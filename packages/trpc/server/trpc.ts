import { initTRPC } from "@trpc/server";
// import { OpenApiMeta } from "trpc-openapi";
import { createContext } from "./context";
import { ZodError } from "zod";
import superjson from "superjson";
export { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

export type Context = Awaited<ReturnType<typeof createContext>>;
export const t = initTRPC
	.context<Context>()
	// .meta<OpenApiMeta>()
	.create({
		errorFormatter({ shape, error }) {
			return {
				...shape,
				data: {
					...shape.data,
					zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
				},
			};
		},
		transformer: superjson,
	});
