import catchAsyncError from "../../middleware/catchAsyncError";
import initializeDynamicModel from "../../model/subscription/CandidateSub";
import ErrorHandler from "../../utils/errorHandler";

export const createSubscription = catchAsyncError(async (req, res, next) => {
    console.log(req.body)
    if (!req.body) {
        return next(new ErrorHandler("body not found", 400));
    }

    const CandidateSub = await initializeDynamicModel
    if (!CandidateSub) {
        return next(new ErrorHandler("Something went wrong while creating Subscription, try latter.", 500));
    }

    const candidateSub = await CandidateSub.create(req.body);

    res.status(200).json({
        success: true,
        candidateSub
    });

})

export const updateSubscription = catchAsyncError(async (req,res) => {
    // console.log(req.body)
    const planId:string = req.body._id;
    const updateDoc = req.body;
    const CandidateSub = await initializeDynamicModel
    const plan = await CandidateSub.findByIdAndUpdate(planId,updateDoc); 
    res.status(200).json({success: true,plan});
})

export const getCandidateSub = catchAsyncError(async (req, res, next) => {


    const CandidateSub = await initializeDynamicModel
    if (!CandidateSub) {
        return next(new ErrorHandler("Something went wrong while creating Subscription, try latter.", 500));
    }

    const subscriptions = await CandidateSub.find();

    res.status(200).json({
        success: true,
        subscriptions
    });

})
