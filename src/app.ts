import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server, ServerOptions } from "socket.io";
import mongoose from "mongoose";
import { setupSocketHandlers } from "./controllers/socketHandler";

dotenv.config();

const { PORT, DB_URL, FE_URL } = process.env;

if (!DB_URL) {
  console.error("DB_URL is not defined in the environment variables");
  process.exit(1);
}

const corsOptions: cors.CorsOptions = {
  origin: FE_URL,
  methods: ["GET", "POST"],
  // allowedHeaders: ["my-custom-header"],
  credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
} as Partial<ServerOptions>);

app.use(cors(corsOptions));
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose
  .connect(DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

setupSocketHandlers(io);

const port = PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
