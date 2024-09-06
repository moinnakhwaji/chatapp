import { TryCatch } from "../middleware/error.js";
import { Chat } from "../models/chat.js";
import { emitEvent, uploadFilesToCloudinary } from "../utils/features.js";
import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFRETCH_CHAT,
} from "../constant/event.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import { ErrorHandler } from "../utils/utility.js";

const newGroupchat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2) {
    return res
      .status(400)
      .json({ msg: "Group chat can't have more than 3 members" });
  }
  const allmembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    members: allmembers,
    creator: req.user,
  });

  emitEvent(req, ALERT, allmembers, `welcome to ${name} group chat `);
  emitEvent(req, REFRETCH_CHAT, members); // ye jab group create ho to refetch hojaye uske liye

  return res.status(201).json({
    sucess: true,
    message: "Group chat created successfully",
  });
});


const getMyChats = TryCatch(async (req, res, next) => {
  const Chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );

  const transformChat = Chats.map(({ _id, name, members, groupChat }) => {
    const othermember = getOtherMember(members, req.user);

    return {
      _id,
      name: groupChat ? name : othermember?.name || "Unknown",
      avatar: groupChat
        ? members
            .slice(0, 3)
            .map((member) => member?.avatar?.url || "default-avatar-url")
        : othermember?.avatar?.url || "default-avatar-url",
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
      groupChat,
    };
  });

  return res.status(201).json({
    success: true,
    Chats: transformChat,
  });
});

const getmygroup = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
  }).populate("members", "name avatar");

  const group = chats.map((chat) => {
    return {
      _id: chat._id,
      name: chat.name,
      groupChat: chat.groupChat,
      avatar: chat.members.slice(0, 3).map((member) => member.avatar.url), // Corrected slice and member access
    };
  });

  return res.status(201).json({
    success: true,
    group,
  });
});


const addmember = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("You are not allowed to add members", 403));
  


  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100)
    return next(new ErrorHandler("Group members limit reached", 400));

  await chat.save();

  const allUsersName = allNewMembers.map((i) => i.name).join(", ");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} has been added in the group`
  );

  emitEvent(req, REFRETCH_CHAT, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members added successfully",
  });
});

const removemember = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;

  const [chat, userThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) {
    return res.status(404).json({ success: false, message: "Chat not found" });
  }

  if (!chat.groupChat) {
    return res
      .status(400)
      .json({ success: false, message: "This is not a group chat" });
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return res
      .status(403)
      .json({ success: false, message: "You are not allowed to remove  members" });
  }

  if (chat.members.length <= 3) {
    return res
      .status(400)
      .json({ success: false, message: "Group must have at least 3 members" });
  }

  const allChatMembers = chat.members.map((i) => i.toString());

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(req, ALERT, chat.members, {
    message: `${userThatWillBeRemoved.name} has been removed from the group`,
    chatId,
  });

  emitEvent(req, REFRETCH_CHAT, allChatMembers);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});

const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));

  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== req.user.toString()
  );

  if (remainingMembers.length < 3)
    return next(new ErrorHandler("Group must have at least 3 members", 400));

  if (chat.creator.toString() === req.user.toString()) {
    const randomElement = Math.floor(Math.random() * remainingMembers.length);
    const newCreator = remainingMembers[randomElement];
    chat.creator = newCreator;
  }

  chat.members = remainingMembers;

  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, {
    chatId,
    message: `User ${user.name} has left the group`,
  });

  return res.status(200).json({
    success: true,
    message: "Leave Group Successfully",
  });
});

const sendAttachments = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;

  const files = req.files || [];

  if (files.length < 1)
    return next(new ErrorHandler("Please Upload Attachments", 400));

  if (files.length > 5)
    return next(new ErrorHandler("Files Can't be more than 5", 400));

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (files.length < 1)
    return next(new ErrorHandler("Please provide attachments", 400));

  //   Upload files here
  const attachments = await uploadFilesToCloudinary(files);
  // console.log("this is attachment",attachments)

  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };
  // console.log("this is db",messageForDB)

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: me._id,
      name: me.name,
    },
  };

  const message = await Message.create(messageForDB);

  emitEvent(req, NEW_MESSAGE, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  return res.status(200).json({
    success: true,
    message,
  });
});


const getChatDetail = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId)
    .populate("members", "name avatar")
    .lean();

  if (!chat) {
    return res.status(400).json({ success: false, message: "Chat not found" });
  }

  chat.members = chat.members.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar?.url || null,
  }));

  return res.status(200).json({ success: true, message: chat });
});

const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.creator.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not allowed to rename the group", 403)
    );

  chat.name = name;

  await chat.save();

  emitEvent(req, REFRETCH_CHAT, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group renamed successfully",
  });
});


const DeleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not allowed to delete the group", 403)
    );

  if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
    return next(
      new ErrorHandler("You are not allowed to delete the chat", 403)
    );
  }

  //   Here we have to dete All Messages as well as attachments or files from cloudinary

  const messagesWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];

  messagesWithAttachments.forEach(({ attachments }) =>
    attachments.forEach(({ public_id }) => public_ids.push(public_id))
  );

  await Promise.all([
    // deletFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvent(req, REFRETCH_CHAT, members);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

const getMessage = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;

  const resultPerPage = 20;
  const skip = (page - 1) * resultPerPage;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.members.includes(req.user.toString()))
    return next(
      new ErrorHandler("You are not allowed to access this chat", 403)
    );

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(resultPerPage)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  });
});

export {
  newGroupchat,
  getMyChats,
  getmygroup,
  addmember,
  removemember,
  leaveGroup,
  sendAttachments,
  getChatDetail,
  renameGroup,
  DeleteChat,
  getMessage,
};
