import z from "zod";

export const createMessageSchema = z
  .object({
    content: z.string(),
    channelId: z.string().uuid().nonempty("channel ID must not be empty"),
  })
  .strict();

export type CreateMessage = z.infer<typeof createMessageSchema>;

export const updateMessageSchema = createMessageSchema.partial();

export type UpdateMessage = z.infer<typeof updateMessageSchema>;
