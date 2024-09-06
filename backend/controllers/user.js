import { TryCatch } from "../middleware/error.js";
import { User } from "../models/user.js";
import bcrypt, { compare } from "bcrypt";
import { cookieOption, emitEvent, sendToken,uploadFilesToCloudinary} from "../utils/features.js";
import { Chat } from "../models/chat.js";
import {Request} from "../models/request.js"
import { NEW_REQUEST, REFRETCH_CHAT } from "../constant/event.js";
import { getOtherMember } from "../lib/helper.js";
import { ErrorHandler } from "../utils/utility.js";

const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  const file = req.file;

  if (!file) return next(new ErrorHandler("Please Upload Avatar"));

  const result = await uploadFilesToCloudinary([file]);

  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  const user = await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });

  sendToken(res, user, 201, "User created");
});



const Login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  // Find the user and include the password in the result
  const user = await User.findOne({ username }).select("+password");

  // Check if the user exists
  if (!user) {
    return res.status(401).json({ message: "check username or password", success:false });

  }

  try {
      // Compare the provided password with the stored hash
      const isMatched = await bcrypt.compare(password, user.password);

      // Check if the password is correct
      if (!isMatched) {
          return res.status(400).json({ message: "check username or password" });
      }

      // Send the token
      sendToken(res, user, 200, "Welcome back");
  } catch (error) {
    return res.status(500).json({message: error });
  }
});


// get my profile 

const GetMyProfile = TryCatch(async (req, res, next) => {
 const user = await User.findById(req.user).select("-password")
  res.status(200).json({ success:true,message:"this is get my profile page",user });
});



const Logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("chattu-token", "", { ...cookieOption, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

//search user 

const SearchUser = async (req, res, next) => {
  const { name } = req.query;

  // Fetch chats where the groupChat is false and the user is a member
  const mychats = await Chat.find({ groupChat: false, members: req.user });

  // Get all user IDs from the chats
  const allUserfromMychat = mychats.flatMap((chat) => chat.members);

  // Fetch all users except the ones in allUserfromMychat
  // Also, filter by name if provided
  const allUsersexceptmeandmyfreind = await User.find({
    _id: { $nin: allUserfromMychat },
    name: name ? { $regex: name, $options: "i" } : undefined
  });

  // Map users to include only avatar URL
  const users = allUsersexceptmeandmyfreind.map(({ _id, avatar, name }) => ({
    _id,
    name,
    avatar: avatar.url
  }));

  // Return the response
  return res.status(200).json({
    users,
    message: "User searched successfully"
  });
};

const sendFreindrequest = TryCatch(async(req,res,next)=>{
  const {userId} = req.body;
  const request = await Request.findOne({
    $or:[
      {sender:req.user,recevier:userId},
      {sender:userId,recevier:req.user},
    ]
  })
  if(request){
    return res.status(400).json({message:"you already sent a request to this user"})
  }
  const newRequest = await Request.create({
    sender:req.user,
    recevier:userId,
  })
  emitEvent(req,NEW_REQUEST,[userId])
  return res.status(200).json({message:"request sent successfully",request})
})


const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("recevier", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.recevier._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [request.sender._id, request.recevier._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.recevier.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFRETCH_CHAT, members);

  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});

// recevier




 




const getallnotification = TryCatch(async (req, res, next) => {
  try {
    const requests = await Request.find({ recevier: req.user }).populate("sender", "name avatar");

    const allrequest = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      }
    }));

    return res.status(200).json({ success: true, message: "get all notification", Request: allrequest });
  } catch (error) {
    next(error);
  }
});




const getMyfreinds = TryCatch(async(req,res,next)=>{
  const chatId = req.query.chatId
  const chats = await Chat.find({members:req.user,groupChat:false}).populate("members","name avatar")
  // console.log(chats)

  const freinds = chats.map(({members})=>{
    const otheruser = getOtherMember(members,req.user)
    return {
      _id:otheruser?._id,
      name:otheruser?.name,
      avatar:otheruser?.avatar.url
    }
})
// console.log("user",req.user)
if(chatId){
 const chat = await Chat.findById(chatId)
 const availablefreinds = freinds.filter((freind)=>!chat.members.includes(freind._id))
 return res.status(200).json({success:true,message:"get my freinds in this chat",freinds:availablefreinds})

}else{
  return res.status(200).json({success:true,message:"get my freinds",freinds})
}
})






export { getMyfreinds,newUser,acceptFriendRequest, Login,GetMyProfile,Logout,SearchUser,sendFreindrequest ,getallnotification};