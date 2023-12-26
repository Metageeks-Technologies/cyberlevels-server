import mongoose, { Model } from "mongoose";
import { ICandidate } from "../../types/user";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import JobPost from "../JobPost";

const candidateSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        default: "candidate"
    },
    gender: {
        type: String,
    },
    experienceInShort: {
        type: String,
        enum: ["fresher", "intermediate", "expert"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // validate: [validator.isEmail, "please enter a valid email"],
    },
    isEmailVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    // password: {
    //     type: String,
    //     minlength: [6, "password should have a minimum of 6 characters"],
    //     select: false,
    // },
    avatar: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    resumes: [
        {
            name: String,    // The name of the resume
            s3Key: String,   // S3 object key or reference
        }
    ],
    education: [
        {
            degree: String,
            field: String,
            institute: String,
            startYear: String,
            endYear: String,
            description: String
        }
    ],
    experience: [
        {
            title: String,
            company: String,
            startYear: String,
            endYear: String,
            description: String
        }
    ],
    certificate: {
        type: [String]
    },
    location:
    {
        locality: String,
        city: String,
        country: String,

    }
    ,
    socialSites: {
        linkedIn: {
            type: String,
            default: ""
        },
        twitter: {
            type: String,
            default: ""
        },
        github: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        },
    },
    skills: {
        type: [String],
        default: [],

    },
    softSkills: {
        type: [String],
        default: []
    },
    freeCount: {
        type: Number,
        default: 5,
    },
    bio: {
        type: String,
    },
    testScore: {
        type: Number,
    },
    expectedSalary: {
        currency: {
            abbreviation:String,
            name:String,
            symbol:String
        },
        salary: Number,
        period: {
            type: String,
            enum: ["monthly", "yearly", "weekly", "hourly"]
        }

    },
    notifications: [
        {
            sender: { type: mongoose.Types.ObjectId, ref: 'Employer' },
            message: String,
            redirectUrl: String,
            timestamp: { type: Date, default: Date.now },
            isRead: { type: Boolean, default: false },
        },
    ],
    savedJobs: [{ type: mongoose.Types.ObjectId, ref: 'JobPost' }],
    savedCompanies: [{ type: mongoose.Types.ObjectId, ref: 'Company' }],
    recommendedJobs: [
        {
            type: mongoose.Types.ObjectId, ref: 'JobPost',
            isViewed: false
        }
    ],
    profileCompleted: {
        type: Number,
        default: 0,
    },
    profileViews: {
        type: Number,
        default: 0,
    },
    subscription: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
},
    { timestamps: true }
);


interface CandidateModel extends Model<ICandidate> { }

candidateSchema.pre<ICandidate>('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

candidateSchema.pre<ICandidate>('findOneAndUpdate', async function (next) {

    const requiredFields: (keyof ICandidate)[] = ['firstName', 'lastName', 'email', "gender", "experienceInShort", "avatar", "resumes", "phoneNumber", 'location', 'skills', "bio", "expectedSalary", 'education', 'experience'];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.reduce((count, field) => {
        const value = this.get(field);

        if (typeof value === 'boolean') {
            return count + (value ? 1 : 0);
        }

        return count + (value !== undefined && value !== null && (typeof value !== 'string' || value.trim() !== '') ? 1 : 0);
    }, 0);

    // Calculate and return the completeness as a percentage
    this.profileCompleted = Math.round((completedFields / totalFields) * 100);
    next();
});

//Define a virtual property for profile completeness
// candidateSchema.pre('findOneAndUpdate').get(function (this: ICandidate) {

//     const requiredFields: (keyof ICandidate)[] = ['firstName', 'lastName', 'email', "gender", "experienceInShort", "avatar", "resumes", "phoneNumber", 'location', 'skills', "bio", "expectedSalary", 'education', 'experience'];
//     const totalFields = requiredFields.length;
//     const completedFields = requiredFields.reduce((count, field) => {
//         const value = this.get(field);

//         if (typeof value === 'boolean') {
//             return count + (value ? 1 : 0);
//         }

//         return count + (value !== undefined && value !== null && (typeof value !== 'string' || value.trim() !== '') ? 1 : 0);
//     }, 0);

//     // Calculate and return the completeness as a percentage
//     return Math.round((completedFields / totalFields) * 100);
// });

candidateSchema.methods.createJWT = function (this: ICandidate, accessToken?: string) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment.");
    }

    interface Payload {
        id: string;
        accessToken?: string;
    }
    const payload: Payload = {
        id: this._id,
    };

    if (accessToken) {
        payload.accessToken = accessToken;
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "60d" });
};

candidateSchema.methods.comparePassword = async function (this: ICandidate, givenPassword: string) {
    const isMatch = await bcrypt.compare(givenPassword, this.password);
    return isMatch;
};

export default mongoose.model<ICandidate, CandidateModel>('Candidate', candidateSchema);
