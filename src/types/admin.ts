import mongoose, { Document } from "mongoose";
import type { ILocation } from "./user"

export interface ICandidateForAdmin {
    _id: mongoose.Types.ObjectId,
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    phoneNumber: string;
    avatar: string;
}

export interface IEmployerForAdmin {
    _id: string,
    email: string;
    firstName: string;
    lastName: string;
    gender?: string;
    phoneNumber: string;
    avatar: string;
    company?: {
        name: string;
        companyId: string;
    };
}

export interface ICompanyForAdmin {
    _id: mongoose.Types.ObjectId,
    email: string;
    founderName: string;
    contactNumber: string;
    logo: string;
    teamSize: string;
    location: ILocation[];
}