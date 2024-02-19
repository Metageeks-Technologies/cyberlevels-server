import catchAsyncError from "../middleware/catchAsyncError";
import Feedback from "../model/Feedback";
import JobApp from "../model/JobApp";
import Candidate from "../model/user/Candidate";
import { ICandidate } from "../types/user";
import ErrorHandler from "../utils/errorHandler";

export const askFeedback = catchAsyncError(async (req, res, next) => {

    const { appId, question, candidateId } = req.body;

    if (!appId || !question || !candidateId) {
        return next(new ErrorHandler("Not all value found in request", 400));
    }
    const user = req.user as ICandidate;
    // if (user && user.subscription.feedbackLimit === 0) {
    //     return next(new ErrorHandler("You can't ask for more feedback with you current plan Upgrade your plan to increase your limit ask feedback", 400));
    // }
    const body = {
        jobApp: appId,
        candidateQuestion: {
            candidateId,
            question
        },
    }
    const feedback = await Feedback.create(body);
    await JobApp.findByIdAndUpdate(appId, { isFeedbackAsked: true });
    // user.subscription.feedbackLimit--;
    await user.save();

    res.status(200).json({
        success: true,
        feedback
    })
})

export const responseFeedback = catchAsyncError(async (req, res, next) => {

    const { appId, response, employerId, candidateId, redirectUrl } = req.body;
    console.log(req.body);
    if (!appId || !response || !employerId) {
        return next(new ErrorHandler("Not all value found in request", 400));
    }
    const body = {
        employerResponse: {
            employerId,
            response
        },
    }
    const feedback = await Feedback.findOneAndUpdate({ jobApp: appId }, body, { new: true });

    const notification = {
        sender: employerId,
        message: 'There is a response for one of your job Application',
        redirectUrl
    };
    const candidate = await Candidate.findByIdAndUpdate(candidateId, {
        $push: { notifications: notification },
    }, { new: true });
    if (!candidate) {
        return next(new ErrorHandler("candidate not  found", 404));
    }
    const notificationObject = candidate.notifications[candidate.notifications.length - 1];
    // console.log(notificationObject);


    res.status(200).json({
        success: true,
        feedback,
        notification: notificationObject
    })
})
export const getFeedback = catchAsyncError(async (req, res, next) => {

    const { id: appId } = req.params;
    console.log(req.body);
    if (!appId) {
        return next(new ErrorHandler("appId in request", 400));
    }

    const feedback = await Feedback.findOne({ jobApp: appId });

    res.status(200).json({
        success: true,
        feedback
    })
})


