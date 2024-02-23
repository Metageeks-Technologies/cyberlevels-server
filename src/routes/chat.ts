import express from 'express';
import { addMessage, getChatsByEmployer, getMessages, initiateChat } from '../controller/chatController';
const chatRouter = express.Router();

chatRouter.route("/create").post(initiateChat);
chatRouter.route("/add").post(addMessage);
chatRouter.route("/get/:id").get(getMessages);
chatRouter.route("/getAll/:id").get(getChatsByEmployer);

export default chatRouter;
