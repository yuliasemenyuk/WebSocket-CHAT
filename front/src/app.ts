import "./app.css";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import { Message } from "./types";
import {
  updateUIWithUserInfo,
  updateConnectedUsersList,
  displayMessage,
  notification,
} from "./handlers";
import { textNotification } from "./utils";

let isAuthenticated = false;

//To prevent show content untill styles loaded
const loader = document.getElementById("loader")!;
const chatContainer = document.getElementById('chat-container')!;
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
  document.body.style.visibility = 'visible';
  loader.style.display = "none";
  chatContainer.style.display = "flex";
  }, 300);
});

//Connecting to server, set reconnection options
export const socket = io(process.env.HOST, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

socket.on("connect", () => {
  //Check session token on connect
  if (!isAuthenticated) {
    const sessionToken = Cookies.get("sessionToken");
    if (sessionToken) {
      socket.emit("login", sessionToken);
    } 
  }
  console.log("Connected to server");
});

//Notification about new user
socket.on("userConnected", (user: {name: string}) => {
  textNotification(`User ${user.name} connected to chat`, "success")
});

//Notification if user left the chat
socket.on("userDisonnected", (user: {name: string}) => {
  textNotification(`User ${user.name} left the chat`, "success")
});

socket.on("usersList", (users: Array<{ id: string; name: string }>) => {
  updateConnectedUsersList(users);
});

//After successful login status session token is saved to cookies and exists for 1 month (resaved after each login)
socket.on(
  "loginSuccess",
  (data: { sessionToken: string; user: { id: string; name: string } }) => {
    Cookies.set("sessionToken", data.sessionToken, { expires: 30 });
    updateUIWithUserInfo(data.user);
    isAuthenticated = true;
  }
);

//If login failed notification is displayed and after 1 second login form 
//will be shown and user will be forced to recreate his account
socket.on("loginError", () => {
  Cookies.remove("sessionToken");
  isAuthenticated = false;
  textNotification("Authentification failed, try again", "error");
  setTimeout(() => {
    location.reload();
  }, 1000);
});

//Load last 20 messages 
socket.on("history", (history: Message[]) => {
  history.map((msg) => displayMessage(msg));
});

//Display message and notify with sound
socket.on("message", (message: Message) => {
  console.log("New message:", message);
  notification.play();
  displayMessage(message);
});

//Notify if there's en error on sent
socket.on("messageError", () => {
  textNotification("Failed to send message", "error");
});

//If msg is sent notify and clean input
socket.on("messageSuccess", () => {
  const messageInput = document.getElementById(
    "message-input"
  )! as HTMLInputElement;
  textNotification("Message sent", "success");
  messageInput.value = "";
});

//DISCONNECTION/RECONNECTION HANDLING

socket.on("disconnect", (reason) => {
  console.log("Disconnected from server:", reason);
  textNotification(
    "Lost connection to server. Attempting to reconnect...",
    "error"
  );
});

socket.io.on("reconnect_attempt", (attemptNumber) => {
  console.log("Attempting to reconnect:", attemptNumber);
  textNotification(`Reconnection attempt ${attemptNumber}...`, "error");
});

//Auth after successful reconnection
socket.io.on("reconnect", (attemptNumber) => {
  console.log("Reconnected on attempt:", attemptNumber);
  textNotification("Reconnected to server", "success");
  const sessionToken = Cookies.get("sessionToken");
  if (sessionToken) {
    socket.emit("login", sessionToken);
  } else {
    location.reload();
  }
});

socket.io.on("reconnect_error", (error) => {
  console.error("Reconnection error:", error);
  textNotification(
    "Failed to reconnect. Please check your internet connection.",
    "error"
  );
});

socket.io.on("reconnect_failed", () => {
  console.error("Failed to reconnect");
  textNotification(
    "Failed to reconnect after multiple attempts. Please refresh the page or try again later.",
    "error"
  );
});

//To prevent show content untill styles loaded
document.addEventListener('DOMContentLoaded', function() {
  document.body.style.visibility = 'visible';
});
