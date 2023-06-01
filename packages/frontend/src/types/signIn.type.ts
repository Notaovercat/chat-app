import z from "zod";

export const signInSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

export type SignInInput = z.infer<typeof signInSchema>;
