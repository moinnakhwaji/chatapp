import express from "express";
import { 
  acceptFriendRequest, 
  getallnotification, 
  getMyfreinds, 
  GetMyProfile, 
  Login, 
  Logout, 
  newUser, 
  SearchUser, 
  sendFreindrequest 
} from "../controllers/user.js";
import { singleAvatar } from "../middleware/multer.js";
import { isAuthenticated } from "../middleware/auth.js";
import { 
  getallnotificationvalidator, 
  loginvalidator, 
  registervalidator,
  sendRequestValidator,
  validateHandeler 
} from "../lib/validator.js";

const app = express.Router();

app.post("/new", singleAvatar, registervalidator(), validateHandeler, newUser);
app.post("/login", loginvalidator(), validateHandeler, Login);

app.use(isAuthenticated);

// Authenticated routes
app.get("/me", GetMyProfile);
app.get("/logout", Logout);
app.get("/search", SearchUser);
app.put("/sendRequest", sendRequestValidator(), validateHandeler, sendFreindrequest);
app.put("/acceptreq", acceptFriendRequest);
app.get("/notification", getallnotification);
app.get("/getmyfreinds", getMyfreinds);

export default app;
