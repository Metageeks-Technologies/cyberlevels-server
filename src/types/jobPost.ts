import mongoose, { Document } from "mongoose";

export interface IJobPost extends Document {
    title: string;
    description: string;
    location: string;
    jobType: string[];
    jobCategory: string;
    workMode: string[];
    preferredLanguage: string;
    primarySkills: string[];
    secondarySkills: string[];
    salary: {
        minimum: number;
        maximum: number;
        isDisclosed: boolean;
    };
    status: "active" | "expired",
    preferredExperience: string[];
    companyId: mongoose.Types.ObjectId;
    employerId: mongoose.Types.ObjectId;
    candidates: mongoose.Types.ObjectId[];
    testQuestions: string;
    isSaved?: boolean;
    matchScore?: number;
}
