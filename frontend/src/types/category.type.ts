import z from "zod";
import type { Chanel } from "./channel.type";

export const createCategorySchema = z
  .object({
    name: z.string().min(4, "Category name must have more than 5 characters"),
    serverId: z.string().uuid().nonempty("Server ID must not be empty"),
  })
  .strict();

export type CreateCategory = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export interface Category {
  id: string;
  name: string;
  serverId: string;
  creatorId: string;
  chanels: Chanel[];
  createdAt: Date;
  updatedAt: Date;
}
