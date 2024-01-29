import mongoose, { Document } from "mongoose";
import type { ILocation } from "./user"


interface IFunding {
    amount: string,
    fundedBy: string,
    yearOfFunding: string,
    round: string,
}

export interface ICompany extends Document {
    name: string;
    email: string;
    logo: string;
    contactNumber?: string;
    website: string;
    founderName: string;
    foundedDate: Date;
    funding: IFunding[];
    location: ILocation[];
    teamSize: string;
    category: string;
    about: string;
    jobPosts: string[];
    socialSites: string[];
    benefits: string[];
    createdBy: string;
    savedByCandidates: string[];
    isSaved?: boolean;
    jobOpenings?: number;
}