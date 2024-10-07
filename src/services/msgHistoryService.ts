import { OutMessage } from "../utils/types";
import { MessageModel } from "../models/Message";

export const msgHistoryService = {
  async saveMessage(message: OutMessage): Promise<void> {
    await MessageModel.create(message);
  },

  async getLastMessages(): Promise<OutMessage[] | []> {
    return MessageModel.find().limit(10);
  },
};
