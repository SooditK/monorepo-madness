import { z } from "zod";

export const loginSchema = z.object({ email: z.string(), password: z.string() });
export const signUpSchema = z.object({
	email: z.string(),
	password: z.string(),
	name: z.string(),
	phone_number: z.string(),
	profile_image_url: z.string(),
	roles: z.array(z.string()),
});
