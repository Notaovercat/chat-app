import type { Category } from "./category.type";
import type { Message } from "./message.type";
import type { Server } from "./server.type";

export interface Profile {
  id: string;
  avatarUrl: string;
  username: string;
  email: string;
  joinedServers: Server[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends Profile {
  createdServers: Server[];
  createdCategories: Category[];
  messages: Message[];
}
