import mongoose from "mongoose";
export interface User {
  _id: string;
  name: string;
  sessionToken: string;
}

export interface ConnectedUser {
  _id: string;
  name: string;
  sessionToken: string
}

export interface ConnectedUsers {
  [clientId: string]: User;
}

export interface Message {
  type: "text" | "audio";
  content: string;
  timestamp: number;
}

export interface OutMessage {
  userId: mongoose.Types.ObjectId | string;
  userName: string;
  type: "text" | "audio";
  content: string | Buffer;
  timestamp: number;
  sessionToken: string
}
