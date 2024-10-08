import { Schema, model } from "mongoose";
import { OutMessage } from "../utils/types";

const type = (Schema: OutMessage) => Schema.type === "audio" ? Buffer : String;

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
        // type: type(messageSchema),
      type: Buffer,
      required: [true, "Set message content"],
    },
    timestamp: {
      type: Number,
      required: [true, "Set timestamp for the message"],
    },
  },
  {
    versionKey: false,
  }
);

export const MessageModel = model<OutMessage>("message", messageSchema);
