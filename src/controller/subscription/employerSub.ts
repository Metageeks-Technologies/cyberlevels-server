import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import EmployerSub from "../../model/subscription/EmployerSub";

export const createSubscription = catchAsyncError(async (req, res, next) => {

    if (!req.body) {
        return next(new ErrorHandler("body not found", 400));
    }

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


    if (!EmployerSub) {
        return next(new ErrorHandler("Something went wrong while creating Subscription, try latter.", 500));
    }

    const subscriptions = await EmployerSub.find();

    res.status(200).json({
        success: true,
        subscriptions
    });

})

export const updateSubscription = catchAsyncError(async (req, res) => {
    const planId: string = req.body._id;
    const updateDoc = req.body;
    // const EmployerSub = await initializeDynamicModel
    const plan = await EmployerSub.findByIdAndUpdate(planId, updateDoc);
    res.status(200).json({ success: true, data: plan });
})
