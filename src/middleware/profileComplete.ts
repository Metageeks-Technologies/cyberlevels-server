import { Request, Response, NextFunction } from 'express';
import { ICandidate } from '../types/user';
import catchAsyncError from './catchAsyncError';

const profileComplete = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    console.log('profileComplete 123');
    if (req.user && 'isProfileCompleted' in req.user && req.user.isProfileCompleted === false) {
        console.log('profileComplete middleware');
        const candidate = req.user as ICandidate;
        const { firstName, lastName, gender, experienceInShort, avatar, phoneNumber, resumes, education, experience, location, skills, softSkills, bio, expectedSalary } = candidate
        if (firstName && lastName && gender && avatar && phoneNumber && resumes.length && education.length && experience.length && location && skills.length && softSkills.length && bio && expectedSalary) {
            candidate.isProfileCompleted = true;
            console.log('profileComplete middleware making true');
            await candidate.save();
        }
    }

    next();
})

export default profileComplete;
