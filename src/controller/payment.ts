import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import Payment from "../model/Payment";
import { razorpay } from "../utils/razorpayConfig";
import crypto from "crypto";

export const checkout = catchAsyncError(async (req, res, next) => {

    const options = {
        amount: Number(100 * 100),
        currency: "INR",
        receipt: "order_rcptid_11"
    };
    const order = await razorpay.orders.create(options);
    if (!order) {
        return next(new ErrorHandler("something went wrong", 500));
    }
    res.status(200).json({
        success: true,
        order
    });

})

export const paymentVerification = catchAsyncError(async (req, res, next) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

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
        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        res.redirect(
            `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
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