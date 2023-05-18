import z from "zod";
import type { Category } from "./category.type";
import type { User } from "./user.type";

export const createServerSchema = z
  .object({
    name: z.string().min(5, "Server name must have more than 5 characters"),
  })
  .strict();

export type CreateServer = z.infer<typeof createServerSchema>;

export const updateServerSchema = createServerSchema.partial();

export type UpdateServer = z.infer<typeof updateServerSchema>;

export interface Server {
  id: string;
  name: string;
  image?: string;
  // categories: Category[];
  // members: User[];
  // createdAt: Date;
  // updatedAt: Date;
}
