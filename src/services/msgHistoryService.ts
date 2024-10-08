import { OutMessage } from "../utils/types";
import { MessageModel } from "../models/Message";

export const msgHistoryService = {
  async saveMessage(message: OutMessage): Promise<void> {
    let messageToSave = message;
    if (message.type === "audio") {
      messageToSave.content = Buffer.from(message.content);
    } else if (message.type === "text" && typeof message.content === "string"){
        messageToSave.content = Buffer.from(message.content, 'utf8')
    }
    await MessageModel.create(messageToSave);
  },

  async getLastMessages(): Promise<OutMessage[] | []> {
    const history = await MessageModel.find().sort({ timestamp: -1 }).limit(20);

    const plainHistory = history.map((doc) => ({
      // _id: doc._id.toString(),
      userId: doc.userId.toString(),
      userName: doc.userName,
      type: doc.type,
      content: doc.type === "audio" ? doc.content : doc.content.toString(),
      timestamp: doc.timestamp,
      sessionToken: doc.sessionToken
    }));

    return plainHistory.sort((a, b) => a.timestamp - b.timestamp);
  },
};
