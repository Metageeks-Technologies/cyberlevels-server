import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import JobPost from "../model/JobPost";
import fs from 'fs'
import Company from "../model/Company";
import Candidate from "../model/user/Candidate";
import { calculateMatchScore, calculateScoreForSkills } from "../utils/helper";
import { ICandidate } from "../types/user";
import { IJobPost } from "../types/jobPost";
import mongoose from "mongoose";

export const addJobPost = catchAsyncError(async (req, res, next) => {

    if (!req.body) {
        return next(new ErrorHandler("body not found", 400));
    }

    console.log(req.body);


    const job = await JobPost.create(req.body);

    res.status(200).json({
        job,
        success: true,
    })
})
export const getDetails = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;
    // this could be done using auth middlewere by req.user
    if (!id) {
        return next(new ErrorHandler("job post not found", 400));
    }

    const job = await JobPost.findOne({ _id: id }).populate('companyId');
    if (!job || !req.user) {
        return next(new ErrorHandler("job post not found", 404));
    }
    const candidate = req.user as ICandidate

    const score = Math.floor(calculateMatchScore(candidate.skills, job.primarySkills, job.secondarySkills));

    const jobObject = job.toObject();
    const jobWithScore = {
        ...jobObject,
        matchScore: score,
    };

    console.log(jobWithScore)

    res.status(200).json({
        job: jobWithScore,
        success: true,
    })
})

export const deleteJobPost = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler("job post not found", 400));
    }

    await JobPost.findByIdAndDelete({ _id: id });
    const p = 1;
    const limit = 8;
    const skip = (p - 1) * limit;

    let result = await JobPost.find({}).skip(skip).limit(limit);
    const totalJobPost = await JobPost.countDocuments({});
    const totalNumOfPage = Math.ceil(totalJobPost / limit);
    console.log(totalNumOfPage);

    res.status(200).json({
        success: true,
        totalNumOfPage,
        totalJobPost,
        result,
    });

})

export const getJobPosts = catchAsyncError(async (req, res, next) => {

    const { page, location, jobType, jobCategory, workMode, status, salary, preferredExperience, candidateId, companyId } = req.query;

    if (!candidateId) {
        return next(new ErrorHandler("CandidateId Not found", 404))
    }


    const queryObject: any = {}
    if (location) {
        let desiredLocation: string | string[] = location as string;
        desiredLocation = desiredLocation.split(",");
        queryObject.location = { $in: desiredLocation }
    }
    if (jobType) {
        let desiredJobTypes: string | string[] = jobType as string
        desiredJobTypes = desiredJobTypes.split(",");
        queryObject.jobType = { $all: desiredJobTypes };
    }
    if (jobCategory) {
        let desiredJobCategory: string | string[] = jobCategory as string;
        desiredJobCategory = desiredJobCategory.split(",");
        queryObject.jobCategory = { $in: desiredJobCategory }
    }
    if (workMode) {
        let desiredWorkMode: string | string[] = workMode as string;
        desiredWorkMode = desiredWorkMode.split(",");
        queryObject.workMode = { $in: desiredWorkMode }
    }
    if (preferredExperience) {
        let desiredExperience: string | string[] = preferredExperience as string
        desiredExperience = desiredExperience.split(",");
        queryObject.preferredExperience = { $all: desiredExperience };
    }
    if (companyId) {
        queryObject.companyId = companyId;
    }
    if (status) {
        queryObject.status = status
    }

    //user provides a number, such as salary=4, to find job posts with salary ranges that include this number:
    const userProvidedSalary = Number(salary);
    if (!isNaN(userProvidedSalary) && salary !== "-1") {
        queryObject.$or = [
            {
                'salary.minimum': { $lte: userProvidedSalary },
                'salary.maximum': { $gte: userProvidedSalary },
            },
            {
                'salary.minimum': { $gte: userProvidedSalary },
                'salary.maximum': { $lte: userProvidedSalary },
            },
        ];
    }

    console.log(page)
    const p = Number(page) || 1;
    const limit = 8;
    const skip = (p - 1) * limit;

    let jobPosts = await JobPost.find(queryObject).skip(skip).limit(limit);
    const totalJobPost = await JobPost.countDocuments(queryObject);
    const totalNumOfPage = Math.ceil(totalJobPost / limit);
    // console.log(totalNumOfPage);


    // is jobSaved by the candidate who is requesting
    const candidate = await Candidate.findById({ _id: candidateId });
    if (!candidate) {
        return next(new ErrorHandler("User not Found", 401));
    }
    const savedJobs = candidate.savedJobs as string[];
    let result = jobPosts.map((job) => {
        const isSaved = savedJobs.includes(job._id);
        const jobObject = job.toObject();
        return {
            ...jobObject,
            isSaved,
        };
    })


    res.status(200).json({
        success: true,
        totalNumOfPage,
        totalJobPost,
        result,
    });

})

export const getJobPostsForEmployer = catchAsyncError(async (req, res, next) => {

    const { employerId } = req.params;

    const jobPosts = await JobPost.find({ employerId }).limit(5);

    res.status(200).json({
        success: true,
        jobPosts
    })
})

export const populateJobPost = catchAsyncError(async (req, res, next) => {
    const location = 'mockData/jobPost.json'
    let jobPosts: any = ""

    fs.readFile(location, 'utf8', async function (err, data) {
        if (err) {
            console.error('There was an error reading the file!', err);
            return;
        }

        jobPosts = JSON.parse(data);
        await JobPost.insertMany(jobPosts)
        // console.log(jobPosts[1]);

    });

    res.send({ msg: "true" })

})

export const getRelatedJobs = catchAsyncError(async (req, res, next) => {

    const { jobId } = req.query;
    if (!jobId) {
        return next(new ErrorHandler("jobId  not Found", 400));
    }
    const currJob = await JobPost.findById(jobId, "primarySkills");
    if (!currJob) {
        return next(new ErrorHandler("job not Found", 404));
    }
    const relevantJobs = await JobPost.find({
        _id: { $ne: currJob._id },
        primarySkills: {
            $in: currJob?.primarySkills,
        }
    }, "primarySkills").sort({ createdAt: -1 });

    const relatedJobs = relevantJobs.map(job => ({
        job: job,
        score: Math.floor(calculateScoreForSkills(job.primarySkills, currJob.primarySkills))
    }))

    const sortedRelatedJobs = relatedJobs.sort((a, b) => b.score - a.score).slice(0, Math.min(5, relatedJobs.length));
    const jobIds = sortedRelatedJobs.map(job => job.job._id);
    const fullRelatedJobs = await JobPost.find({ _id: { $in: jobIds }});

    res.status(200).json({
        success: true,
        jobs: fullRelatedJobs
    })
})

export const getAllJobPost = catchAsyncError(async (req,res) => {
    const response = await JobPost.find({}).sort({createdAt:-1}).limit(5)

    res.status(200).send({jobPosts:response});
}) 
