import mongoose, { Schema, Document } from 'mongoose';
import { IJobPost } from '../types/jobPost';
import Candidate from './user/Candidate';


const jobPostSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: [String],
        required: true,
    },
    benefits: {
        type: [String],
    },
    jobType: {
        type: [String],
        // enum: ['full-time', 'part-time', 'internship', 'hourly-contract', 'fixed-price'],
        required: true,
    },
    jobCategory: {
        type: String
    },
    workMode: {
        type: [String],
    },
    preferredLanguage: {
        type: String
    },
    primarySkills: {
        type: [String],
        default: []
    },
    secondarySkills: {
        type: [String],
        default: []
    },
    salary: {
        minimum: Number,
        maximum: Number,
        isDisclosed: Boolean,
        currency: {
            type: String,
            default: "Canadian dollars"
        },
        salary: Number,
        period: {
            type: String,
            enum: ["monthly", "yearly", "weekly", "hourly","By-weekly"]
        }
    },
    status: {
        type: String,
        enum: ["active", "expired"],
        default: 'active',
    },
    preferredExperience: {
        type: [String],
    },
    deadlineDate: Date,
    companyId: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
    },
    employerId: {
        type: mongoose.Types.ObjectId,
        ref: 'Employer',
    },
    candidates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
        },
    ],
    testQuestions: {
        type: String
    },
},
    { timestamps: true }
);

// Create and export the Job Post model
const JobPost = mongoose.model<IJobPost>('JobPost', jobPostSchema);

export default JobPost;
