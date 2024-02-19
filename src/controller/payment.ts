import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import Payment from "../model/Payment";
import { razorpay } from "../utils/razorpayConfig";
import crypto from "crypto";
import serverCache from "../utils/cache";
import { sendMail } from "../utils/nodemailer";
import Candidate from "../model/user/Candidate";
import Employer from "../model/user/Employer";
import { ICandidateSub, IEmployerSub } from "../types/subscription";

interface IPaymentData {
    amount: number;
    currency: string;
    duration: string;
    user: string;
    userModel: string;
    product: string;
    productModel: string;
}

export const checkout = catchAsyncError(async (req, res, next) => {

    const { amount, currency, duration } = req.body;
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
    // console.log(req.body);

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
    // console.log("1");

    if (isAuthentic) {
        const data = serverCache.get(razorpay_order_id) as IPaymentData;
        if (!data) {
            return next(new ErrorHandler('Payment Verification Failed', 500));
        }
        const { userModel, } = data;
        // console.log(data);
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
        console.log(payment, "payment");
        if (!payment || !payment.user || !payment.product) {
            return next(new ErrorHandler('Payment Verification Failed', 500));
        }
        // console.log("3");
        let user;

        if (userModel === "Candidate") user = await Candidate.findOne({ _id: payment.user._id });
        else if (userModel === "Employer") user = await Employer.findOne({ _id: payment.user._id });


        if (!user) {
            return next(new ErrorHandler('Payment Verification Failed', 500));
        }
        console.log("4");
        const subscription = payment.product;
        const currentPrice = subscription.price.filter((price: any) => price.duration === payment.duration);
        let userSubscription = payment.product;
        userSubscription.price = currentPrice;
        const subs = {
            ...userSubscription,
        }

        console.log(subs, "userSubscription");
        user.paymentDate = new Date(),
            user.subscription = subs;
        await user.save();
        const emailData = {
            amount: payment.amount,
            subscriptionType: payment.product.subscriptionType,
            email: payment.user.email,
            userName: payment.user.firstName + payment.user.lastName,
        }

        // console.log(payment);

        sendMail("candidate", 'paymentSuccess', emailData);

        res.redirect(
            // `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
            `${process.env.CLIENT_URL}/dashboard/${payment.product.subscriptionFor}-dashboard/membership`
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
