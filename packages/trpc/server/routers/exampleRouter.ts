import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../procedures/index";
import { t } from "../trpc";

export const exampleRouter = t.router({
	exampleApi: publicProcedure
		.input(z.void())
		.output(z.object({ message: z.string() }))
		.query(() => {
			return { message: "Sending message from route" };
		}),

	exampleInput: publicProcedure
		.input(z.object({ id: z.string() }))
		.output(z.object({ id: z.string() }))
		.query(({ input }) => {
			return { id: input.id };
		}),

	protectedExample: protectedProcedure
		.input(z.void())
		.output(z.object({ message: z.string() }))
		.query(() => {
			return { message: "Protected example message" };
		}),
});
