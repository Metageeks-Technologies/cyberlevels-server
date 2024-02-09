import mongoose, { Schema } from 'mongoose';
import { ICompany } from '../types/company';

const companySchema: Schema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    logo: {
        type: String,
        default: ""
    },
    contactNumber: {
        type: String,
    },

    foundedDate: {
        type: Date,
    },
    founderName: {
        type: String,
    },
    location: [
        {
            locality: String,
            city: String,
            country: String,
        }
    ],
    funding: [
        {
            amount: String,
            fundedBy: String,
            yearOfFunding: String,
            round: String,
        }
    ],
    teamSize: {
        type: String,

    },
    category: {
        type: String
    },
    about: {
        type: String,
    },
    jobPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPost',
        },
    ],
    socialSites: {
        linkedIn: {
            type: String,
            default: ""
        },
        twitter: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        },
        facebook: {
            type: String,
            default: ""
        },
    },
    benefits: {
        type: [String],
        default: [],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer'
    },
    savedByCandidates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }


}, {
    timestamps: true
}
);


const Company = mongoose.model<ICompany>('Company', companySchema);

export default Company;
