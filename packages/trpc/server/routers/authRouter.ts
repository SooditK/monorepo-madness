// export const authRouter = t.router({
//   signup: publicProcedure
//     .input(
//       z.object({ email: z.string(), password: z.string(), name: z.string() })
//     )
//     .output(z.object({ message: z.string() }))
//     .mutation(async ({ ctx, input }) => {
//       const hashedPassword = await new Argon2id().hash(input.password);
//       const userId = generateId(15);
//       try {
//         await ctx.db
//           .insertInto("User")
//           .values({
//             id: userId,
//             email: input.email,
//             hashed_password: hashedPassword,
//             name: input.name,
//           })
//           .execute();

//         const session = await auth.createSession(userId, {});
//         const sessionCookie = auth.createSessionCookie(session.id);
//         ctx.res.setHeader("Set-Cookie", sessionCookie.serialize());
//         ctx.res.setHeader("Location", "/");
//         return {
//           message: "User created",
//         };
//       } catch {
//         // db error, email taken, etc
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: "Email already taken",
//           cause: null,
//         });
//       }
//     }),

//   login: publicProcedure
//     .input(z.object({ email: z.string(), password: z.string() }))
//     .output(z.object({ message: z.string() }))
//     .mutation(async ({ ctx, input }) => {
//       const user = await ctx.db
//         .selectFrom("User")
//         .select(["id", "email", "hashed_password"])
//         .where("email", "=", input.email)
//         .executeTakeFirst();
//       if (!user) {
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: "Bad Credentials",
//           cause: null,
//         });
//       }
//       const passwordMatches = await new Argon2id().verify(
//         user.hashed_password,
//         input.password
//       );
//       if (!passwordMatches) {
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: "Bad Credentials",
//           cause: null,
//         });
//       }
//       const session = await auth.createSession(user.id, {});
//       const sessionCookie = auth.createSessionCookie(session.id);
//       console.log(sessionCookie.serialize());
//       ctx.res.setHeader("Set-Cookie", sessionCookie.serialize());
//       ctx.res.setHeader("Location", "/");
//       return {
//         message: "Login Successfull",
//       };
//     }),

//   user: publicProcedure
//     .input(z.void())
//     .output(UserModel.omit({ hashed_password: true }))
//     .query(async ({ ctx }) => {
//       console.log("Cookies", ctx.req.headers.cookie);
//       const sessionId = auth.readSessionCookie(
//         ctx.req.headers.cookies?.toString() ?? ""
//       );

//       if (!sessionId) {
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: "No session cookie",
//           cause: null,
//         });
//       }

//       const { session, user } = await auth.validateSession(sessionId);
//       if (session?.fresh) {
//         ctx.res.appendHeader(
//           "Set-Cookie",
//           auth.createSessionCookie(session.id).serialize()
//         );
//       }
//       if (!session) {
//         ctx.res.appendHeader(
//           "Set-Cookie",
//           auth.createBlankSessionCookie().serialize()
//         );
//       }
//       if (!user) {
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: "Who are you?",
//         });
//       }
//       return user;
//     }),
// });
