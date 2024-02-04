import * as dotenv from "dotenv";
import { Kysely, PostgresAdapter, PostgresIntrospector, PostgresQueryCompiler } from "kysely";
import { DB } from "./src/db/types";
import kyselyExtension from "prisma-extension-kysely";
import { PrismaClient } from "@prisma/client";
dotenv.config();

export const prisma = new PrismaClient().$extends(
	kyselyExtension({
		kysely: (driver) =>
			new Kysely<DB>({
				dialect: {
					createDriver: () => driver,
					createAdapter: () => new PostgresAdapter(),
					createIntrospector: (db) => new PostgresIntrospector(db),
					createQueryCompiler: () => new PostgresQueryCompiler(),
				},
				plugins: [],
			}),
	}),
);

export * from "@prisma/client";
export * from "./src/zod";
