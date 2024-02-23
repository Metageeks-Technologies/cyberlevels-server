import catchAsyncError from "../middleware/catchAsyncError";
import DiscountCoupon from "../model/couponCode";
import ErrorHandler from "../utils/errorHandler";

export const createCoupon = catchAsyncError(async (req, res, next) => {
    const { code, discountPercentage, expirationDate, description } = req.body;
    const coupon = await DiscountCoupon.create({
        code,
        discountPercentage,
        expirationDate,
        description
    });
    res.status(201).json({
        success: true,
        coupon,
    });
});

export const getAllCoupons = catchAsyncError(async (req, res, next) => {
    const {page} = req.query;
    const p = Number(page) || 1;
    const limit = 8;
    const skip = (p-1)*limit;

    const coupons = await DiscountCoupon.find().skip(skip).limit(limit);
    const totalCoupons = await DiscountCoupon.countDocuments({});
    const totalPages = totalCoupons/limit;

    res.status(200).json({
        success: true,
        coupons,
        itemsPerPage:limit,
        totalPages,
        totalCoupons,
        // currPage:p
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



