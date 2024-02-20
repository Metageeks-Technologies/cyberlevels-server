import axios from "axios"
import { NextFunction } from "express";
import ErrorHandler from "./errorHandler";
import Company from "../model/Company";


export const isActive = async (token: string, next: NextFunction) => {
    const requestData = {
        client_id: process.env.CLIENT_ID || "",
        client_secret: process.env.CLIENT_SECRET || "",
        token: token
    };
    const formData = new URLSearchParams(requestData).toString();
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
        const { data } = await axios.post("https://www.linkedin.com/oauth/v2/introspectToken", formData, { headers })
        return data?.active;
    } catch (error) {
        return next(new ErrorHandler("Error while Token introspection", 400))
    }
}

export const isActiveGoogle = async (token: string, next: NextFunction) => {
    const requestData = {
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        accessToken: token
    };
    const formData = new URLSearchParams(requestData).toString();
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
        const { data } = await axios.post("https://www.googleapis.com/oauth2/v3/tokeninfo?", formData, { headers })
        console.log(data, "isActive Data from the google");
        const isTokenActive: any = (): boolean => {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const tokenExpirationTime = parseInt(data.exp);

            return tokenExpirationTime > currentTimeInSeconds;
        };
        console.log(isTokenActive(), "Active")
        return isTokenActive();
        //   console.log(`Token is ${activeStatus}`);
        // return data?.active;
    } catch (error) {
        console.log(error, "Error")
        return next(new ErrorHandler("Error while Token introspection", 400))
    }
}

export function calculateMatchScore(userSkills: string[], jobPrimarySkills: string[], jobSecondarySkills: string[]) {

    // It will come from the Database
    const weightOfPrimarySkill = 80;
    const weightOfSecondarySkill = 20;


    // Calculate score for primary skills
    const primaryScore = calculateScoreForSkills(userSkills, jobPrimarySkills);
    const totalPrimaryPer = (primaryScore / jobPrimarySkills.length) * 100;

    // Calculate score for secondary skills
    const secondaryScore = calculateScoreForSkills(userSkills, jobSecondarySkills);

    const totalSecondaryPer = (secondaryScore / jobSecondarySkills.length) * 100;

    const _80PerOfPrimaryPer = (totalPrimaryPer * weightOfPrimarySkill) / 100;

    // Calculate overall score
    const _20PerOfPrimaryPer = (totalSecondaryPer * weightOfSecondarySkill) / 100;
    const overallScore = _80PerOfPrimaryPer + _20PerOfPrimaryPer;
    // console.log("overallScore", _80PerOfPrimaryPer, _20PerOfPrimaryPer)

    return overallScore;
}

export function calculateScoreForSkills(userSkills: string[], jobSkills: string[]) {
    let score = 0;

    jobSkills.forEach((jobSkill) => {
        const userSkillIndex = userSkills.indexOf(jobSkill);

        if (userSkillIndex !== -1) {
            score += 1;
        }
    });

    return score;
}

export const getCandidatesWhoSavedCompany = async (companyId: string) => {

    const company = await Company.findOne({ _id: companyId }, { savedByCandidates: 1, name: 1 });

    return { candidates: company?.savedByCandidates, companyName: company?.name };
}

export const hasOneMonthOrGreaterGap = async(candidateJoinDate:Date) => {
    const currentDate = new Date();
    const joinDate = new Date(candidateJoinDate);
  
    // Calculate the difference in years, months, and days
    const yearsDiff = currentDate.getFullYear() - joinDate.getFullYear();
    const monthsDiff = currentDate.getMonth() - joinDate.getMonth();
    const daysDiff = currentDate.getDate() - joinDate.getDate();
  
    // Check if the difference is greater than or equal to 1 month
    return yearsDiff * 12 + monthsDiff + (daysDiff >= 0 ? 0 : -1) >= 1;
  }