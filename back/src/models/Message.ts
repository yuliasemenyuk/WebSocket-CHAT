import { Schema, model } from "mongoose";
import { OutMessage } from "../utils/types";

const messageSchema = new Schema<OutMessage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "Set user id for the message"],
      ref: "user",
    },
    userName: {
      type: String,
      required: [true, "Set user name for the message"],
    },
    type: {
      type: String,
      required: [true, "Set message type"],
      enum: ["audio", "text"],
    },
    content: {
      type: Buffer,
      required: [true, "Set message content"],
    },
    timestamp: {
      type: Number,
      required: [true, "Set timestamp for the message"],
    },
    sessionToken: {
      type: String,
      required: [true, "Set sender's session token"],
    },
  },
  {
    versionKey: false,
  }
);

export const MessageModel = model<OutMessage>("message", messageSchema);
