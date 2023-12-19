import catchAsyncError from "../../middleware/catchAsyncError";
import initializeDynamicModel from "../../model/subscription/CandidateSub";
import ErrorHandler from "../../utils/errorHandler";

export const createSubscription = catchAsyncError(async (req, res, next) => {

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
    const planId:string = req.body.planId;
    const updateDoc = req.body.data;
    const CandidateSub = await initializeDynamicModel
    const plan = await CandidateSub.findByIdAndUpdate(planId,req.body.data); 
    res.status(200).json({success: true,data:plan});
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
