import { User } from "../utils/types";
import { UserModel } from "../models/User";
import { v4 as uuidv4 } from "uuid";

export const userService = {
  async getUserBySessionToken(sessionToken: string): Promise<User | null> {
    return UserModel.findOne({ sessionToken });
  },

  async createUser(name: string): Promise<User> {
    const sessionToken = uuidv4();
    const user = await UserModel.create({ name, sessionToken });
    return user;
  },

  async getUserById(id: string): Promise<User | null> {
    return UserModel.findById(id);
  },

  async getUserList(): Promise<User[] | []> {
    return UserModel.find();
  }
};
