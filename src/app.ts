import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

dotenv.config();

const { PORT, DB_URL } = process.env;

if (!DB_URL) {
  console.error("DB_URL is not defined in the environment variables");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect(DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
  
});

const port = PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

export { app, io };