import { OutMessage } from "../utils/types";
import { MessageModel } from "../models/Message";

export const msgHistoryService = {
  async saveMessage(message: OutMessage): Promise<void> {
    let messageToSave = message;
    if (message.type === "audio") {
      messageToSave.content = Buffer.from(message.content);
    }
    await MessageModel.create(messageToSave);
  },

  async getLastMessages(): Promise<OutMessage[] | []> {
    const history = await MessageModel.find().limit(20);

    const plainHistory = history.map((doc) => ({
      // _id: doc._id.toString(),
      userId: doc.userId.toString(),
      userName: doc.userName,
      type: doc.type,
      content: doc.type === "audio" ? Buffer.from(doc.content) : doc.content,
      timestamp: doc.timestamp,
    }));

    return plainHistory;
  },
};
