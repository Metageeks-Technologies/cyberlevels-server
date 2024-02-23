import catchAsyncError from "../middleware/catchAsyncError";
import DiscountCoupon from "../model/CouponCode";
import ErrorHandler from "../utils/errorHandler";


export const createCoupon = catchAsyncError(async (req, res, next) => {
    const { code, discountPercentage, expirationDate } = req.body;
    const coupon = await DiscountCoupon.create({
        code,
        discountPercentage,
        expirationDate,
    });
    res.status(201).json({
        success: true,
        coupon,
    });
});

export const getAllCoupons = catchAsyncError(async (req, res, next) => {
    const coupons = await DiscountCoupon.find();
    res.status(200).json({
        success: true,
        coupons,
    });
});

export const getCoupon = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await DiscountCoupon.findById(id);
    if (!coupon) {
        return next(new ErrorHandler("Coupon not found", 404));
    }
    res.status(200).json({
        success: true,
        coupon,
    });
});

export const editCoupon = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await DiscountCoupon.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    if (!coupon) {
        return next(new ErrorHandler("Coupon not found", 404));
    }
    res.status(200).json({
        success: true,
        coupon,
    });
}
);

export const isValidCoupon = catchAsyncError(async (req, res, next) => {
    const { code } = req.params;
    // console.log(code);
    const coupon = await DiscountCoupon.findOne({ code });
    if (!coupon) {
        return next(new ErrorHandler("Coupon not found", 404));
    }
    if (coupon.expirationDate.getTime() < Date.now()) {
        return next(new ErrorHandler("Coupon has expired", 400));
    }
    if (coupon.isValid === false) {
        return next(new ErrorHandler("Coupon is not valid", 400));
    }
    res.status(200).json({
        success: true,
        coupon,
    });
}
);



