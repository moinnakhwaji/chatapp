import express from "express";
import { addmember, DeleteChat, getChatDetail, getMessage, getmygroup, leaveGroup, newGroupchat, removemember, renameGroup, sendAttachments } from "../controllers/chat.js"
import { isAuthenticated } from "../middleware/auth.js";
import { getMyChats } from "../controllers/chat.js";
import { attachmentsMulter } from "../middleware/multer.js";
import { addmemeberValidator, chatIdValidator, newGroupValidator, removememberValidator, renameGroupValidator, sendAttachementValidator, validateHandeler } from "../lib/validator.js";


const app = express.Router()
app.use(isAuthenticated)

app.post("/new",newGroupValidator(),validateHandeler,newGroupchat)

app.get("/my",getMyChats)

app.get("/my/group",getmygroup) 

app.put("/addmember",addmemeberValidator(),validateHandeler, addmember)

app.put("/removemember",removememberValidator(),validateHandeler,removemember)

app.delete("/leave/:id", chatIdValidator(),validateHandeler , leaveGroup);

// app.post("/message",sendAttachments)
//attachement
app.post("/message",attachmentsMulter ,sendAttachementValidator(),validateHandeler,sendAttachments)

app.get("/message/:id",chatIdValidator(),validateHandeler,getMessage)




app.route('/:id')
  .get(chatIdValidator(), validateHandeler, getChatDetail)
  .put(renameGroupValidator(), validateHandeler, renameGroup)
  .delete( chatIdValidator(),validateHandeler, DeleteChat);



export default app
