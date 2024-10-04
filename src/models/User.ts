import { Schema, model } from "mongoose";
import { User } from "../utils/types";

const userSchema = new Schema<User>(
  {
    name: { type: String, required: [true, "Set name for user"] },
    sessionToken: {
      type: String,
      required: [true, "Set session token for user"],
    },
  },
  {
    versionKey: false,
  }
);

export const UserModel = model<User>("User", userSchema);
