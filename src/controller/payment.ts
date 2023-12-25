import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import Payment from "../model/Payment";
import { razorpay } from "../utils/razorpayConfig";
import crypto from "crypto";
import serverCache from "../utils/cache";
import { sendMail } from "../utils/nodemailer";
import Candidate from "../model/user/Candidate";

export const checkout = catchAsyncError(async (req, res, next) => {

    const { amount, currency } = req.body;
    const options = {
        amount: Number(amount * 100),
        currency: currency,
        receipt: "order_rcptid_11"
    };
    const order = await razorpay.orders.create(options);
    if (!order) {
        return next(new ErrorHandler("something went wrong", 500));
    }

    serverCache.set(order.id, req.body, 1800);// The data will be removed from the cache after 1800 seconds (30 min)

    res.status(200).json({
        success: true,
        order
    });

})

export const paymentVerification = catchAsyncError(async (req, res, next) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
    console.log(req.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const key_id = process.env.RAZORPAY_API_KEY;
    const key_secret = process.env.RAZORPAY_API_SECRET;

    if (!key_id || !key_secret) {
        return next(new ErrorHandler('RAZORPAY_API_KEY and/or RAZORPAY_API_SECRET are missing.', 500))
    }

    const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        const data = serverCache.get(razorpay_order_id);
        if (!data) {
            return next(new ErrorHandler('Payment Verification Failed', 500));
        }
        const paymentData = {
            ...data,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
        }
        let response = await Payment.create(paymentData);
        const payment: any = await Payment.findOne({ _id: response._id })
            .populate('user', ['email', 'firstName', 'lastName'])
            .populate('product');

        if (!payment) {
            return next(new ErrorHandler('Payment Verification Failed', 500));
        }
        const user = await Candidate.findOne({ _id: payment.user._id });
        if (!user) {
            return next(new ErrorHandler('Payment Verification Failed', 500));
        }
        const userSubscription = {
            ...payment.product
        }
        user.subscription = userSubscription;
        await user.save();
        const emailData = {
            amount: payment.amount,
            subscriptionType: payment.product.subscriptionType,
            email: payment.user.email,
            userName: payment.user.firstName + payment.user.lastName,
        }

        console.log(payment);

        sendMail('paymentSuccess', emailData);

        res.redirect(
            // `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
            `http://localhost:3000/dashboard/candidate-dashboard/membership`
        );
    } else {
        res.status(400).json({
            success: false,
        });
    }
})

export const getRazorApiKey = catchAsyncError(async (req, res, next) => {

    const key_id = process.env.RAZORPAY_API_KEY;

    if (!key_id) {
        throw new ErrorHandler('RAZORPAY_API_KEY  Not Found', 500);
    }

    res.status(200).json({
        success: true,
        keyId: key_id
    });
})

export const getPayments = catchAsyncError(async (req, res, next) => {

    const payments = await Payment.find({}).populate('user').populate('product');

    res.status(200).json({
        success: true,
        payments
    });
})
