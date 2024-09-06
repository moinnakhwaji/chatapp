import express from "express"
import { adminLogin, adminLogout, Allmessages, findallChats, findallUser, getDashboardStats } from "../controllers/admin.js";

const app  = express.Router()

app.get("/");
app.post("/verify",adminLogin)
app.get("/logout",adminLogout)

app.get("/user",findallUser)
app.get("/chats",findallChats)
app.get("/message",Allmessages)
app.get("/stats",getDashboardStats)








export default app;
