import z from "zod";

export const createChanelSchema = z
  .object({
    name: z.string().min(4, "Chanel name must have more than 5 characters"),
    categoryId: z.string().uuid().nonempty("Category ID must not be empty"),
  })
  .strict();

export type CreateChanel = z.infer<typeof createChanelSchema>;

export const updateChanelSchema = createChanelSchema.partial();

export type UpdateChanel = z.infer<typeof updateChanelSchema>;

export interface Chanel {
  id: string;
  name: string;
  categoryId: string;
  creatorId: string;
  // messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
