import { Server, Socket } from "socket.io";
import { userService } from "../services/userService";
import { msgHistoryService } from "../services/msgHistoryService";
import { User, ConnectedUsers, Message, OutMessage } from "../utils/types";

export function setupSocketHandlers(io: Server) {
  const users: ConnectedUsers = {};
  function getUsersList(): Array<{ id: string; name: string }> {
    return Object.values(users).map(({ _id, name }) => ({ id: _id, name }));
  }

  io.sockets.on("connection", async (client: Socket) => {
    console.log("A client connected");
    client.emit("usersList", getUsersList());

    client.on("login", async (sessionToken: string) => {
      try {
        const user = await userService.getUserBySessionToken(sessionToken);
        if (user) {
          users[client.id] = { _id: user._id, name: user.name };
          client.emit("loginSuccess", {
            sessionToken: user.sessionToken,
            user: { id: user._id, name: user.name },
          });

          const history = await msgHistoryService.getLastMessages();
          client.emit("history", history);
          io.emit("usersList", getUsersList());
        }
      } catch (error) {
        throw new Error("Failed to login");
      }
    });

    client.on("create", async (userName: string) => {
      try {
        const user = await userService.createUser(userName);
        // Send the session token back to the client
        if (user) {
          users[client.id] = { _id: user._id, name: user.name };
          client.emit("loginSuccess", {
            sessionToken: user.sessionToken,
            user: { id: user._id, name: user.name },
          });
          // Broadcast updated users list to all clients
          io.emit("usersList", getUsersList());
        } else {
          throw new Error("Failed to create user");
        }
      } catch (error) {
        console.error("Login error:", error);
        client.emit("loginError", "Failed to create user");
      }
    });

    client.on("message", async (message) => {
      const user = users[client.id];
      console.log(user, "user");
      if (user) {
        let fullMessage: OutMessage;
        if (message.type && message.type === "audio") {
          const audioBuffer = Buffer.from(message.content, "base64");
          fullMessage = {
            userId: user._id.toString(),
            userName: user.name,
            type: "audio",
            content: audioBuffer,
            timestamp: message.timestamp || Date.now(),
          };
        } else {
          fullMessage = {
            userId: user._id,
            userName: user.name,
            type: "text",
            content: message.content,
            timestamp: message.timestamp || Date.now(),
          };
        }

        // Broadcast the message to all clients
        console.log(fullMessage);
        io.emit("message", fullMessage);
        //Save to msg history
        await msgHistoryService.saveMessage(fullMessage);
      } else {
        console.error("Message received from unknown user");
        client.emit("error", "You are not logged in");
      }
    });

    client.on("disconnect", () => {
      if (users[client.id]) {
        delete users[client.id];
        // Broadcast updated users list after a user disconnects
        io.emit("usersList", getUsersList());
      }
    });
  });
}
