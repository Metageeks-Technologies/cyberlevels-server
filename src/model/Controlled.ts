import mongoose, { Schema, Document } from 'mongoose';
import { IJobPost } from '../types/jobPost';


const jobPostSchema: Schema = new Schema({

    primarySkills: {
        type: [String],
        default: []
    },
    SecondarySkills: {
        type: [String],
        default: [],
    },
    companyBenefits: {
        type: [String],
        default: []
    },
    jobBenefits: {
        type: [String],
        default: []
    },
},
    { timestamps: true }
);

// Create and export the Job Post model
const JobPost = mongoose.model<IJobPost>('JobPost', jobPostSchema);

export default JobPost;
