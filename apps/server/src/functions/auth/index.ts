import { prisma as database } from "db";

export async function getUserFromEmail(db: typeof database, email: string) {
	const user = await db.$kysely
		.selectFrom("user")
		.select(["id", "email", "hashed_password"])
		.where("email", "=", email)
		.executeTakeFirst();
	return user;
}

type CreateUserInput = {
	db: typeof database;
	id: string;
	email: string;
	name: string;
	hashed_password: string;
	phone_number: string;
	profile_image_url: string;
	roles: string[];
};

export async function createUser(input: CreateUserInput): Promise<string> {
	await input.db.$kysely
		.insertInto("user")
		.values({
			...input,
			last_updated_at: new Date(),
		})
		.execute();
	return input.id;
}
