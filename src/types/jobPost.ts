import mongoose, { Document } from "mongoose";
interface JobPostView {
    viewed_by:mongoose.Types.ObjectId;
    view_count?: number;
    view_timestamp?: string;
}
export interface IJobPost extends Document {
    title: string;
    description: string;
    location: string[];
    jobType: string[];
    benefits: string[];
    jobCategory: string;
    workMode: string[];
    preferredLanguage: string;
    preferredQualification: string;
    primarySkills: string[];
    secondarySkills: string[];
    workHours: string;
    joiningTime: string;
    salary: {
        minimum: number;
        maximum: number;
        isDisclosed: boolean;
        currency: {
            abbreviation:string;
            name:string;
            symbol:string;
        };
        period: "monthly" | "yearly" | "weekly" | "hourly";
    };
    status: "active" | "expired",
    preferredExperience: string[];
    deadlineDate:Date;
    companyId: mongoose.Types.ObjectId;
    employerId: mongoose.Types.ObjectId;
    candidates: mongoose.Types.ObjectId[];
    testQuestions: string;
    isSaved?: boolean;
    matchScore?: number;
    views:JobPostView[]
}
