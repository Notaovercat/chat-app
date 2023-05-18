import type { Category } from "./category.type";
import type { Message } from "./message.type";
import type { Server } from "./server.type";

export interface Profile {
  id: string;
  username: string;
  email: string;
  joinedServers: Server[];
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  joinedServers: Server[];
  createdServers: Server[];
  createdCategories: Category[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
