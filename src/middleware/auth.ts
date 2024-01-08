import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import Candidate from "../model/user/Candidate.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { isActive, isActiveGoogle } from "../utils/helper.js";
import { ICandidate } from "../types/user.js";
import Employer from "../model/user/Employer.js";



interface CustomJwtPayload extends JwtPayload {
    id: string;
    accessToken: string;
}


export const isAuthenticatedCandidate = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    // console.log(token);
    // const token = ""
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment.");
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET) as CustomJwtPayload;
    console.log("decodedData", decodedData);
    
    // if logged in with linkedIn
    if (decodedData.hasOwnProperty('accessToken')) {
        let isAccessTokenActiveGoogle = await isActiveGoogle(decodedData.accessToken,next);
        let isAccessTokenActive = await isActive(decodedData.accessToken, next);
       
        
        if (!isAccessTokenActive && !isAccessTokenActiveGoogle) {
            return next(new ErrorHandler("token has been expired", 401));
        }
    }

    const candidate = await Candidate.findOne({ _id: decodedData.id })
    if (!candidate) {
        return next(new ErrorHandler("user not found with associated token", 401));
    }
    req.user = candidate as ICandidate;

    next();
})

export const isAuthenticatedEmployer = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    console.log(token);
    // const token = ""
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment.");
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET) as CustomJwtPayload;
    console.log("decodedData", decodedData);

    // if logged in with linkedIn
    if (decodedData.hasOwnProperty('accessToken')) {
        let isAccessTokenActive = await isActive(decodedData.accessToken, next);
        if (!isAccessTokenActive) {
            return next(new ErrorHandler("token has been expired", 401));
        }
    }

    const employer = await Employer.findOne({ _id: decodedData.id })
    if (!employer) {
        return next(new ErrorHandler("user not found with associated token", 401));
    }
    req.user = employer;
    next();
})