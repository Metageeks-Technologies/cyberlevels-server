import mongoose, { Schema, Document } from 'mongoose';
import { IJobPost } from '../types/jobPost';
import Candidate from './user/Candidate';

const jobPostSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    descrption: {
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
            abbreviation: String,
            name: String,
            symbol: String
        },
        period: {
            type: String,
            enum: ["monthly", "yearly", "weekly", "hourly", "By-weekly"]
        }
    },
    status: {
        type: String,
        enum: ["active", "expired"],
        default: 'active',
    },
    preferredQualification: {
        type: String,
    },
    preferredExperience: {
        type: [String],
    },
    workHours: {
        type: String
    },
    joiningTime: {
        type: String,
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
    description: {
        type: String,
    },
    views: [
        {
            viewed_by:{
                type: mongoose.Types.ObjectId,
                ref:'Candidate'
            },
            view_count: {
                type: Number,
                default: 0,
            },
            view_timestamp: {
                type: Date,
                default: Date.now(),
            },
        },
    ],


},
    { timestamps: true }
);

// Create and export the Job Post model
const JobPost = mongoose.model<IJobPost>('JobPost', jobPostSchema);

export default JobPost;
