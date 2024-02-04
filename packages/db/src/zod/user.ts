import * as z from "zod";
import { CompleteSession, RelatedSessionModel } from "./index";

export const UserModel = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string(),
	hashed_password: z.string(),
});

export interface CompleteUser extends z.infer<typeof UserModel> {
	sessions: CompleteSession[];
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
	UserModel.extend({
		sessions: RelatedSessionModel.array(),
	}),
);
