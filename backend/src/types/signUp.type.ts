import z from "zod";

export const signUpSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

export type SignUpInput = z.infer<typeof signUpSchema>;
