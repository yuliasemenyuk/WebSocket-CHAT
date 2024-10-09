import fs from "fs";
import path from "path";
import { OutMessage } from "./types";

const logFilePath = process.env.CHAT_LOG_PATH || path.join(__dirname, "../../chat.log");

export function logMessageToFile(message: OutMessage) {
  const messageContent =
    message.type === "audio" ? "Audio message" : message.content;

  const logEntry = `${new Date(message.timestamp).toISOString()} - User: ${
    message.userName
  }, Message: ${messageContent}\n`;

  

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error("Error writing to log file:", err);
  });
}
