import { Request } from "express";

//Models interfaces
export interface User {
  _id: string;
  name: string;
  sessionToken: string;
}

//Other
export interface RequestWithUser extends Request {
  user: User;
}
