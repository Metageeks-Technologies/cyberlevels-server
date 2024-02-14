import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import Candidate from "../model/user/Candidate.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { isActive, isActiveGoogle } from "../utils/helper.js";
import { ICandidate, IEmployer } from "../types/user.js";
import Employer from "../model/user/Employer.js";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  accessToken: { accessToken: string; provider: string };
}

export const isAuthenticatedCandidate = catchAsyncError(
  async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
      return next(
        new ErrorHandler("Please Login to access this resource", 401)
      );
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment.");
    }
    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as CustomJwtPayload;

    const candidate = await Candidate.findOne({ _id: decodedData.id });
    // console.log(candidate)
    if (!candidate) {
      return next(
        new ErrorHandler("user not found with associated token", 401)
      );
    }
    req.user = candidate as ICandidate;

    next();
  }
);

export const isAuthenticatedEmployer = catchAsyncError(
  async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
      return next(
        new ErrorHandler("Please Login to access this resource", 401)
      );
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment.");
    }
    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as CustomJwtPayload;

    console.log(decodedData.id)

    const employer = await Employer.findOne({ _id: decodedData.id });
    console.log(employer)
    if (!employer) {
      return next(
        new ErrorHandler("user not found with associated token Hello", 401)
      );
    }
    req.user = employer as IEmployer;
    next();
  }
);
