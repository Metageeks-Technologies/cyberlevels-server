import catchAsyncError from "../middleware/catchAsyncError";
import Chat from "../model/Chat";
import JobApp from "../model/JobApp";
import Candidate from "../model/user/Candidate";
import ErrorHandler from "../utils/errorHandler";
import { sendMail } from "../utils/nodemailer";

export const initiateChat = catchAsyncError(async (req, res, next) => {
  const { appId, candidateId, employerId } = req.body;
  console.log(req.body);

  if (!appId || !candidateId || !employerId) {
    return next(new ErrorHandler("all required felid not found", 400));
  }
  const body = {
    jobApp: appId,
    participants: [employerId, candidateId],
    messages: [],
  };

  const chat = await Chat.create(body);
  const jobApp = await JobApp.findById(appId).populate({
    path: "jobPost",
    select: "title jobCode",
  });
  const notification = {
    sender: employerId,
    message: `You have a chat initiated for ${
      typeof jobApp?.jobPost !== "string"
        ? jobApp?.jobPost.title
        : jobApp?.jobPost
    } (${
      typeof jobApp?.jobPost !== "string"
        ? jobApp?.jobPost.jobCode
        : jobApp?.jobPost
    }) job application`,
    redirectUrl: `/dashboard/candidate-dashboard/jobs`,
  };
  const candidate = await Candidate.findByIdAndUpdate(candidateId, {
    $push: { notifications: notification },
  });
  const data = {
    email: candidate?.email,
    title: typeof jobApp?.jobPost !== "string" ? jobApp?.jobPost.title : "",
    jobCode: typeof jobApp?.jobPost !== "string" ? jobApp?.jobPost.jobCode : "",
  };
  sendMail("candidate", "chat initialisation", data);
  res.status(200).json({
    success: true,
    chat,
  });
});

export const addMessage = catchAsyncError(async (req, res, next) => {
  const { chatId, role, userId, text } = req.body;

  if (!chatId) {
    return next(new ErrorHandler("chatId not found", 400));
  }
  const newMessage = {
    role,
    userId,
    text,
  };

  const chats = await Chat.findOneAndUpdate(
    { _id: chatId },
    { $addToSet: { messages: newMessage } },
    { new: true }
  );
  if (!chats) {
    return next(new ErrorHandler("chat not found", 404));
  }
  const chat = chats.messages[chats.messages.length - 1];
  res.status(200).json({
    success: true,
    chat,
  });
});
export const getMessages = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("chatId not found", 400));
  }

  const chat = await Chat.findOne({ jobApp: id });
  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  res.status(200).json({
    success: true,
    chat: chat,
  });
});

export const getChatsByEmployer = catchAsyncError(async (req, res, next) => {
  const { id: employerId } = req.params;

  if (!employerId) {
    return next(new ErrorHandler("chatId not found", 400));
  }

  const chats = await Chat.find({
    "participants.0": employerId, // Assuming employerId is the first participant
  });
  if (!chats) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  res.status(200).json({
    success: true,
    chat: chats,
  });
});
