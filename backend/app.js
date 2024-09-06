import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./constant/config.js";
import { v2 as cloudinary } from "cloudinary";
import { socketAuthenticator } from "./middleware/auth.js";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING } from "./constant/event.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 4000;
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const userSocketIDs = new Map();
const onlineUsers = new Set();

const app = express();

const adminSecretKey = process.env.ADMIN_SECRET || "adsasdsdfsdfsdfd";

const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

app.set("io", io);
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/v4/user", userRoute);
app.use("/api/v4/chat", chatRoute);
app.use("/api/v4/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello guys");
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) => {
    await socketAuthenticator(err, socket, next);
  });
});

io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDB);
    } catch (error) {
      throw new Error(error);
    }
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} MODE`);
});

export default app;
export { adminSecretKey, envMode, userSocketIDs };
