import { TryCatch } from "../middleware/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken"
import { cookieOption } from "../utils/features.js";
import { adminSecretKey } from "../app.js";


const adminLogin = TryCatch(async (req, res, next) => {
  console.log('Admin login attempt:', req.body);
  const { secretKey } = req.body; // Use 'secretKey' to match the request payload
  console.log('Secret key received:', secretKey);

  const adminSecretKey = "moin" || "adsasdsdfsdfsdfd";
  const isMatch = adminSecretKey === secretKey;

  if (!isMatch) {
    console.log('Admin key mismatch');
    return res.status(401).json({ message: "Invalid Admin key" });
  }

  const token = jwt.sign({ secretKey }, process.env.JWT_SECRET);
  console.log('Token generated:', token);

  res.status(200)
    .cookie("chattu_token_Admin", token, {
      ...cookieOption,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    })
    .json({
      success: true,
      message: "Admin logged in successfully",
    });
});



const adminLogout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("chattu-admin-token", "", {
      ...cookieOption,
      maxAge: 0,
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});





const findallUser = TryCatch(async(req,res,next)=>{
    const user = await User.find();
    const transformedUser = user.map(async({name,username,avatar,_id})=>{
        const [group,freinds] = await Promise.all([  
            Chat.countDocuments({groupChat:false,members:_id}),// ye wala stored hoga group me  
            Chat.countDocuments({groupChat:true,members:_id}),// ye wala freind me hoga 
          ])
        return{
            _id,
            name,
            username,
            avatar:avatar.url,
            group,
            freinds
        }
    })
   return res.status(200).json({
    success:true,
    users:await Promise.all(transformedUser)
//   Used to wait for all the promises returned by the map function to resolve, ensuring all user transformations are complete before sending the response.
   })
})


const findallChats = async (req, res, next) => {
    const chats = await Chat.find({})
        .populate("members", "name avatar")
        .populate("creator", "name avatar");

    const transformedchat = await Promise.all(chats.map(async ({ members, _id, groupChat, name, creator }) => {
        const totalmessages = await Message.countDocuments({ chat: _id });
        return {
            _id,
            groupChat,
            name,
            avatar: members.slice(0, 3).map(member => member.avatar.url),
            totalmessages,
            members: members.map(member => ({
                name: member.name,
                avatar: member.avatar.url,
            })),
            creator: {
                name: creator?.name || "None",
                avatar: creator?.avatar?.url || ""
            }
        };
    }));

    return res.status(200).json({ success: true, chat: transformedchat });
};

// all messages

const Allmessages = TryCatch(async(req,res,next)=>{
    const messages = await Message.find({}).populate("sender","name avatar").populate("chat","groupChat")
    const transformedMessages = messages.map(({_id,content,attachments,sender,chat,createdAt})=>({

        _id,
     content,
     attachments:attachments.map(({url})=>url),
     createdAt,
     chat:chat?._id || "",
     groupChat:chat?.groupChat || false,
     sender:{
         _id:sender._id,
         name:sender.name,
         avatar:sender.avatar?.url || ""
     },
     
}))


    return res.status(200).json({success:true,chat:transformedMessages})
})

const getDashboardStats = TryCatch(async (req, res) => {
    const [groupsCount, usersCount, messagesCount, totalChatsCount] =
      await Promise.all([
        Chat.countDocuments({ groupChat: true }),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
      ]);
  
    const today = new Date();
  
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
  
    const last7DaysMessages = await Message.find({
      createdAt: {
        $gte: last7Days,
        $lte: today,
      },
    }).select("createdAt");
  
    const messages = new Array(7).fill(0);
    const dayInMiliseconds = 1000 * 60 * 60 * 24;
  
    last7DaysMessages.forEach((message) => {
      const indexApprox =
        (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds;
      const index = Math.floor(indexApprox);
  
      messages[6 - index]++;
    });
  
    const stats = {
      groupsCount,
      usersCount,
      messagesCount,
      totalChatsCount,
      messagesChart: messages,
    };
  
    return res.status(200).json({
      success: true,
      stats,
    });
  });



export {findallUser,adminLogout,findallChats,Allmessages,getDashboardStats,adminLogin}