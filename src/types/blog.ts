import mongoose, { Document } from "mongoose";

export interface IBlogPost extends Document {
    title: string;
    content: string;
    category: string[];
    mainImage?: string;
    createdBy: {
        id: string;
        name: string;
    };
    comments: {
        userId: string;
        userAvatar: string;
        userName: string;
        text: string;
        timestamp: Date;
    }[];
}