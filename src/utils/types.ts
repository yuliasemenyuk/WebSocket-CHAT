import { Request } from "express";

//Models interfaces
export interface User {
  _id: string;
  name: string;
  sessionToken: string;
}

//Other
export interface ConnectedUser {
  _id: string;
  name: string;
}

export interface ConnectedUsers {
  [clientId: string]: ConnectedUser;
}

export interface Message {
  content: string;
  timestamp: number;
}
export interface RequestWithUser extends Request {
  user: User;
}
