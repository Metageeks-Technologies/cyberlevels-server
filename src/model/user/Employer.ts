import mongoose, { Model } from "mongoose";
import { IEmployer } from "../../types/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const employerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: "employer",
    },
    password: {
      type: String,
      minlength: [6, "password should have a minimum of 6 characters"],
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // validate: [validator.isEmail, "please enter a valid email"],
    },
    provider: {
      type: String,
      default: "Admin",
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },

    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    company: {
      name: String,
      companyId: {
        type: mongoose.Types.ObjectId,
        ref: "Company",
      },
    },
    location: {
      city: String,
      country: String,
    },
    socialSites: {
      linkedIn: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    industry: {
      type: String,
    },
    bio: {
      type: String,
    },

    jobs: [
      {
        type: mongoose.Types.ObjectId,
        ref: "JobPost",
      },
    ],
    signInProvider: {
      type: String,
      enum: ["linkedIn", "jwt"],
    },
    subscription: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    paymentDate: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    savedCandidates: [{ type: mongoose.Types.ObjectId, ref: "Candidate" }],
    lastJobPostLimitUpdated: {
      type: Date,
      default: Date.now(),
    },
    subPayment: {
      type: String,
      default: "free",
    },
  },
  { timestamps: true }
);

interface CandidateModel extends Model<IEmployer> { }

employerSchema.pre<IEmployer>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});



employerSchema.methods.createJWT = function (
  this: IEmployer,
  accessToken: string
) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment.");
  }
  return jwt.sign({ id: this._id, accessToken }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};


employerSchema.methods.comparePassword = async function (
  this: IEmployer,
  givenPassword: string
) {
  const isMatch = await bcrypt.compare(givenPassword, this.password);
  return isMatch;
};


export default mongoose.model<IEmployer, CandidateModel>(
  "Employer",
  employerSchema
);
