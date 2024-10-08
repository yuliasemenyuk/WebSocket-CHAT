import { Server, Socket } from "socket.io";
import { userService } from "../services/userService";
import { msgHistoryService } from "../services/msgHistoryService";
import { ConnectedUsers, OutMessage } from "../utils/types";

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
          users[client.id] = {
            _id: user._id,
            name: user.name,
            sessionToken: user.sessionToken,
          };
          client.emit("loginSuccess", {
            sessionToken: user.sessionToken,
            user: { id: user._id, name: user.name },
          });
          //Show last msgs to new user
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
          users[client.id] = {
            _id: user._id,
            name: user.name,
            sessionToken: user.sessionToken,
          };
          client.emit("loginSuccess", {
            sessionToken: user.sessionToken,
            user: { id: user._id, name: user.name },
          });
          //Show last msgs to new user
          const history = await msgHistoryService.getLastMessages();
          client.emit("history", history);
          // Broadcast updated users list to all clients
          io.emit("usersList", getUsersList());
        } else {
          throw new Error("Failed to create user");
        }
      } catch (error) {
        console.error("Login error:", error);
        client.emit("loginError");
      }
    });

    client.on("message", async (message) => {
      try {
        const user = users[client.id];
        console.log(user, "user");
        if (user) {
          //Length validation
          if (message.type === "text" && message.content.length > 1000) {
            throw Error("Message is too long");
          }

          //Session validation
          if (
            !message.sessionToken ||
            message.sessionToken.toString() !== user.sessionToken.toString()
          ) {
            client.emit("loginError");
          } else {
            const fullMessage: OutMessage = {
              userId: user._id.toString(),
              userName: user.name,
              type: message.type,
              content: message.content,
              timestamp: message.timestamp || Date.now(),
              sessionToken: message.sessionToken,
            };
            console.log(fullMessage);
            io.emit("message", fullMessage);
            //Save to msg history
            await msgHistoryService.saveMessage(fullMessage);
            //Return message success status to sender
            client.emit("messageSuccess");
          }
        } else {
          console.error("Message received from unknown user");
          throw new Error("Failed to sent message");
        }
      } catch (error) {
        console.error(error);
        client.emit("messageError");
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
