import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import dotenv from 'dotenv';
import Employer from "../../model/user/Employer";
import { sendToken } from "../../utils/sendToken";
import Candidate from "../../model/user/Candidate";
import { sendMail } from "../../utils/nodemailer";

dotenv.config();


export const signupEmployer = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("please provide all values", 400))
    }
    const candidateAlreadyExists = await Employer.findOne({ email });
    if (candidateAlreadyExists) {
        return next(new ErrorHandler("Email already in exist", 400))
    }
    const firstName = name.split(" ")[0].trim();
    const lastName = name.split(" ")[1] ? name.split(" ")[1] : "."
    const candidate = await Employer.create({ firstName, lastName, email, password, isEmailVerified: false })
    sendMail("employerSignupEmail",req.body);
    sendToken(candidate, 201, res);
})

export const loginEmployer = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("please provide all values", 400))
    }

    const candidate = await Employer.findOne({ email }).select("+password");
    if (!candidate) {
        return next(new ErrorHandler("Invalid  Email or Password", 400))
    }
    const verifyPassword = await candidate.comparePassword(password);
    if (!verifyPassword) {
        return next(new ErrorHandler("Invalid  Email or Password", 401))
    }

    sendMail("login",req.body);
    sendToken(candidate, 201, res);
})

export const getCurrEmployer = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    // middleware should be there for authentication
    if (!id) {
        return next(new ErrorHandler("Candidate Id Not Found", 400))
    }
    console.log(id)
    const employer = await Employer.findById({ _id: id });

    res.status(200).json({
        success: true,
        employer,
    });
})

export const updateCurrEmployer = catchAsyncError(async (req, res, next) => {

    if (!req.body) {
        return next(new ErrorHandler("body not found", 400));
    }
    const { id } = req.params;
    const employer = await Employer.findByIdAndUpdate({ _id: id }, req.body, { new: true });
    if (!employer) {
        return next(new ErrorHandler("something went wrong ,try again", 500));
    }
    res.status(200).json({
        success: true,
        employer
    })
})
export const updateProfileAvatar = catchAsyncError(async (req, res, next) => {

    const { s3Key, userId, } = req.body;
    if (!s3Key || !userId) {
        return next(new ErrorHandler("all required data not found", 400));
    }
    const publicEndpoint = process.env.AWS_PUBLIC_ENDPOINT;
    if (!publicEndpoint) {
        return next(new ErrorHandler("AWS_PUBLIC_ENDPOINT is not found", 404));
    }

    const avatar = `${publicEndpoint}/${s3Key}`
    // console.log(avatar);

    const employer = await Employer.findByIdAndUpdate(userId, { avatar });
    if (!employer) {
        return next(new ErrorHandler("candidate is not found", 404));
    }


    res.status(200).json({
        success: true,
        avatar: avatar
    });
})
export const getAllEmployer = catchAsyncError(async (req, res, next) => {

    const candidates = await Employer.find();

    res.status(200).json({
        success: true,
        candidates
    })
})
// save Candidate
export const saveCandidate = catchAsyncError(async (req, res, next) => {

    const { employerId, candidateId, page } = req.body;
    // console.log(req.body);
    if (!employerId || !candidateId) {
        return next(new ErrorHandler("employerId or candidateId not found", 400));
    }
    const employer = await Employer.findByIdAndUpdate(employerId, { $addToSet: { savedCandidates: candidateId } }, { new: true });
    if (!employer) {
        return next(new ErrorHandler("employer not found", 404));
    }
    const p = Number(page) || 1;
    const limit = 4;
    const skip = (p - 1) * limit;
    const totalSavedCandidate = employer?.savedCandidates.length;

    const totalNumOfPage = Math.ceil(totalSavedCandidate / limit);
    const updatedEmployer = await Employer.findById(employerId).populate({
        path: 'savedCandidates',
        options: { skip: skip, limit: limit },
    });
    if (!updatedEmployer) {
        return next(new ErrorHandler("Employer not found", 404));
    }

    res.status(200).json({
        success: true,
        savedCandidates: updatedEmployer?.savedCandidates,
        totalSavedCandidate,
        totalNumOfPage
    })
})
export const removeSavedCandidate = catchAsyncError(async (req, res, next) => {

    const { employerId, candidateId, page } = req.query;

    if (!employerId || !candidateId) {
        return next(new ErrorHandler("employerId or candidateId not found", 400));
    }
    const employer = await Employer.findByIdAndUpdate(employerId, { $pull: { savedCandidates: candidateId } }, { new: true });
    if (!employer) {
        return next(new ErrorHandler("employer not found", 404));
    }
    const p = Number(page) || 1;
    const limit = 4;
    const skip = (p - 1) * limit;
    const totalSavedCandidate = employer?.savedCandidates.length;

    const totalNumOfPage = Math.ceil(totalSavedCandidate / limit);
    const updatedEmployer = await Employer.findById(employerId).populate({
        path: 'savedCandidates',
        options: { skip: skip, limit: limit },
    });
    if (!updatedEmployer) {
        return next(new ErrorHandler("Employer not found", 404));
    }

    res.status(200).json({
        success: true,
        savedCandidates: updatedEmployer?.savedCandidates,
        totalSavedCandidate,
        totalNumOfPage
    })
})
export const getSavedCandidate = catchAsyncError(async (req, res, next) => {

    const { employerId, page } = req.query;
    if (!employerId) {
        return next(new ErrorHandler("employerId not found", 400));
    }
    const employerTemp = await Employer.findById(employerId);
    if (!employerTemp) {
        return next(new ErrorHandler("employerId not found", 401));
    }
    const p = Number(page) || 1;
    const limit = 4;
    const skip = (p - 1) * limit;
    const totalSavedCandidate = employerTemp?.savedCandidates.length;

    const totalNumOfPage = Math.ceil(totalSavedCandidate / limit);
    const employer = await Employer.findById(employerId).populate({
        path: 'savedCandidates',
        options: { skip: skip, limit: limit },
    });
    if (!employer) {
        return next(new ErrorHandler("Employer not found", 404));
    }

    res.status(200).json({
        success: true,
        savedCandidates: employer?.savedCandidates,
        totalSavedCandidate,
        totalNumOfPage
    })
})

export const addNotificationToCandidate = catchAsyncError(async (req, res, next) => {

    const { candidateId, employerId, redirectUrl, message } = req.body;

    const notification = {
        sender: employerId,
        message,
        redirectUrl
    };

    const candidate = await Candidate.findByIdAndUpdate(candidateId, {
        $push: { notifications: notification },
    }, { new: true });
    if (!candidate) {
        return next(new ErrorHandler("candidate not  found", 404));
    }
    const notificationObject = candidate.notifications[candidate.notifications.length - 1];

    res.status(200).json({
        success: true,
        notification: notificationObject
    })
})
