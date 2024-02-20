import mongoose, { Document } from "mongoose";
import type { ICompany } from "./company";
import type { IJobPost } from "./jobPost";
import { ICandidateSub } from "./subscription";
import { IEmployerSub } from "./subscription";

interface ProfileView {

    view_count?: number;
    view_timestamp?: string;
}
export interface AdminDocument extends Document {
    name: string;
    email: string;
    password: string,
    avatar: string,
    role: string;
    createJWT(): string;
    comparePassword(givenPassword: string): Promise<boolean>;
}
interface IEducation {
    degree: string;
    field: string;
    institute: string;
    startYear: string;
    endYear: string;
    description: string;
    _id: string
    present: boolean;
}
interface IExperience {
    title: string;
    company: string;
    startYear: string;
    endYear: string;
    description: string;
    present: boolean;
}
interface INotification {
    sender: string,
    message: String,
    redirectUrl: String,
    timestamp: Date,
    isRead: boolean,
    _id: mongoose.Types.ObjectId
}
interface IResume {
    name: String,
    s3Key: String,
}
interface ISocial {
    linkedIn: string,
    twitter: string,
    github: string,
    website: string,
}
interface FSocial {
    linkedIn: string,
    twitter: string,
    facebook: string,
    website: string,
}


export interface ICandidate extends Document {
    email: string;
    isEmailVerified: boolean;
    firstName: string;
    lastName: string;
    avatar: string;
    phoneNumber: string,
    password: string;
    resumes: IResume[],
    signInProvider: "linkedIn" | "jwt"
    skills: string[],
    softSkills: string[],
    certificate: string[],
    role: string,
    location: ILocation,
    isProfileCompleted: boolean,
    provider: string,
    expectedSalary: {
        currency: {
            abbreviation: string;
            name: string;
            symbol: string;
        },
        min: number,
        max: number,
        period: string
    },
    selfDeclaration: {
        gender: string,
        race: string
    },
    preferredLocations: string[],
    preferredLanguages: string[],
    experienceInYears: number,
    experience: IExperience[],
    education: IEducation[],
    socialSites: ISocial;
    experienceInShort: string,
    gender: string,
    bio: string,
    lastLogin: Date,
    isSaved?: boolean,
    paymentDate?: Date,
    savedJobs: string[] | IJobPost[];
    savedCompanies: string[] | ICompany[];
    notifications: INotification[];
    profileViews: ProfileView[];
    subscription: ICandidateSub;
    createJWT(accessToken?: string): string;
    comparePassword(givenPassword: string): Promise<boolean>;
    lastJobAppLimitUpdated:Date,
}



export interface IEmployer extends Document {
    email: string;
    isEmailVerified: boolean;
    firstName: string;
    lastName: string;
    avatar: string;
    phoneNumber: string,
    provider: string,
    company: {
        name: string,
        companyId: mongoose.Types.ObjectId,
    },
    password?: string;
    location: ILocation,
    resume: string,
    industry: string,
    socialSites: FSocial;
    description: string,
    gender: "male" | "female" | "others";
    freeCount: string;
    jobs: string[],
    role: string,
    bio: string,
    lastLogin: Date,
    subscription: IEmployerSub,
    signInProvider?: "linkedIn" | "jwt"
    savedCandidates: string[],
    _id: string,
    paymentDate?: Date,
    createJWT(accessToken?: string): string;
    comparePassword(givenPassword: string): Promise<boolean>;

}

export interface ILocation {
    locality: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    maplocation: string;
}

export interface IControlledFieldSchema extends Document {
    companyCategory: string[],
    jobTitle: string[],
    jobCategory: string[],
    jobIndustry: string[],
}

