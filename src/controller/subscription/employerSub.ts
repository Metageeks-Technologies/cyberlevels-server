import catchAsyncError from "../../middleware/catchAsyncError";
import initializeDynamicModel from "../../model/subscription/EmployerSub";
import ErrorHandler from "../../utils/errorHandler";

export const createSubscription = catchAsyncError(async (req, res, next) => {

    if (!req.body) {
        return next(new ErrorHandler("body not found", 400));
    }

    const EmployerSub = await initializeDynamicModel
    if (!EmployerSub) {
        return next(new ErrorHandler("Something went wrong while creating Subscription, try latter.", 500));
    }

    const employerSub = await EmployerSub.create(req.body);

    res.status(200).json({
        success: true,
        employerSub
    });

})

export const getEmploySub = catchAsyncError(async (req, res, next) => {

    const EmployerSub = await initializeDynamicModel
    if (!EmployerSub) {
        return next(new ErrorHandler("Something went wrong while creating Subscription, try latter.", 500));
    }

    const subscriptions = await EmployerSub.find();

    res.status(200).json({
        success: true,
        subscriptions
    });

})
