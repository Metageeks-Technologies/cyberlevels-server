import mongoose, { Schema } from 'mongoose';
import { IJobApp } from '../types/jobApp';

const jobApplicationSchema: Schema = new Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    jobPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPost',
        required: true,
    },
    isFeedbackAsked: {
        type: Boolean,
        default: false,
    },
    testScore: Number,
    appliedWithResume: String,
    jobLetter: String,

    status: {
        type: String,
        enum: ['Received', 'Under Review', 'Shortlisted', "Not Selected"],
        default: 'Received',
    },
    profileMatchPercent:Number
}, { timestamps: true }
);

const JobApp = mongoose.model<IJobApp>('JobApp', jobApplicationSchema);
export default JobApp;
// 'Interview Scheduled', 'Interviewed', 'Offer Extended', 'Offer Accepted', 'Offer Declined', 'On Hold', 'Hired', 'Not Selected', 'Withdrawn', 'Closed'