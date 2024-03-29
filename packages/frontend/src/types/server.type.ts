import z from "zod";

export const createServerSchema = z
  .object({
    name: z.string().min(5, "Server name must have more than 5 characters"),
  })
  .strict();

export type CreateServerInput = z.infer<typeof createServerSchema>;

export const updateServerSchema = createServerSchema.partial();

export type UpdateServerInput = z.infer<typeof updateServerSchema>;

export interface Server {
  id: string;
  name: string;
  iconName?: string;
  creatorId: string;
  joinCode: string;
  // categories: Category[];
  // members: User[];
  // createdAt: Date;
  // updatedAt: Date;
}
