import { Request, Response, NextFunction } from 'express';
import { ICandidate } from '../types/user';
import catchAsyncError from './catchAsyncError';

const profileComplete = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    // console.log('profileComplete 123');

    if (req.user && 'isProfileCompleted' in req.user && req.user.isProfileCompleted === false) {
        console.log('profileComplete middleware');
        const candidate = req.user as ICandidate;
        const { firstName, lastName, resumes, location, skills, softSkills, } = candidate
        // console.log({
        //     firstName: firstName,
        //     lastName: lastName,
        //     gender: gender,
        //     avatar: avatar,
        //     phoneNumber: phoneNumber,
        //     resumesLength: resumes.length,
        //     educationLength: education.length,
        //     experienceLength: experience.length,
        //     location: location,
        //     skillsLength: skills.length,
        //     softSkillsLength: softSkills.length,
        //     bio: bio,
        //     expectedSalary: expectedSalary
        // });
        if (firstName && lastName && resumes.length && location.city && location.country && skills.length && softSkills.length) {
            candidate.isProfileCompleted = true;
            console.log('profileComplete middleware making true');
            await candidate.save();
        }else{
            candidate.isProfileCompleted = false;
            console.log('profileComplete middleware making false');
            await candidate.save();
        }
    }

    next();
})

export default profileComplete;
