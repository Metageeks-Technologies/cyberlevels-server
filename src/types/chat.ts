import mongoose, { Document } from "mongoose";
import { IJobApp } from "./jobApp";

interface IChatParticipant {
    type: mongoose.Types.ObjectId;
}

interface IChatMessage {
    role: 'candidate' | 'employer';
    userId: string;
    text: string;
    timestamp: Date;
}
export interface IChat extends Document {
    jobApp: mongoose.Types.ObjectId | IJobApp;
    participants: [IChatParticipant, IChatParticipant];
    messages: IChatMessage[];
}