import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";
import { httpBatchLink, loggerLink, type AppRouter, type inferRouterInputs, type inferRouterOutputs } from "trpc";

const getBaseUrl = () => {
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	return `http://localhost:${process.env.SERVER_PORT ?? 3001}`;
};

export const api = createTRPCNext<AppRouter>({
	config() {
		return {
			transformer: superjson,
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error),
				}),
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
				}),
			],
		};
	},
	ssr: false,
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
