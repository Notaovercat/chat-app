import z from "zod";
import type { User } from "./user.type";

export const createMessageSchema = z
  .object({
    content: z.string(),
    chanelId: z.string().uuid().nonempty("channel ID must not be empty"),
  })
  .strict();

export type CreateMessage = z.infer<typeof createMessageSchema>;

export const updateMessageSchema = createMessageSchema.partial();

export type UpdateMessage = z.infer<typeof updateMessageSchema>;

export interface Message {
  id: string;
  content: string;
  chanelId: string;
  isMessageDeleted: boolean;
  isMessageUpdated: boolean;
  creatorId: string;
  createdBy: {
    id: string;
    avatarName: string;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
