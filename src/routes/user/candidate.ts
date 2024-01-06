import express from 'express';
import passport from '../../utils/passportConfig'
import {
    getUserLinkedIn,
    getAllCandidate, saveJob,
    logoutCandidate, signupCandidate,
    loginCandidate, updateCurrCandidate, updateEducation, updateExperience, populateCandidate, getDetails, getCurrCandidate, getSaveJob, removeSavedJob, saveCompany, getSavedCompany, removeSavedCompany, updateNotification, uploadResumeToS3, addResume, downloadResumeFromS3, getRecommendedJobs, deleteResumeFromS3, uploadProfileToS3, updateProfileAvatar, getCandidateProfileViews, getTotalCandidateProfileViews, getCandidateByJoiningDate, getUserGoogle
} from '../../controller/userController/candidate'
import { isAuthenticatedCandidate, isAuthenticatedEmployer } from '../../middleware/auth';

const candidateRouter = express.Router();
// auth 
candidateRouter.get('/auth/google',passport.authenticate('google', {state:'12345678'}));
candidateRouter.get('auth/google/callback',passport.authenticate('google',{successRedirect:"/", failureRedirect:"/login"}))
candidateRouter.post('/auth/getCandidateGoogle', getUserGoogle);
candidateRouter.get('/auth/linkedin', passport.authenticate('linkedin', { state: '12345678' }));
candidateRouter.get('/auth/linkedin/callback', passport.authenticate('linkedin', { successRedirect: "/", failureRedirect: "/login" }));
candidateRouter.post('/auth/getCandidate', getUserLinkedIn)
candidateRouter.post('/auth/signup', signupCandidate)
candidateRouter.post('/auth/login', loginCandidate);
candidateRouter.get('/auth/:id', getCurrCandidate);
candidateRouter.get('/logout', logoutCandidate)
// saveJob
candidateRouter.route("/savedJob").post(saveJob).get(getSaveJob).delete(removeSavedJob);
// saveCompany
candidateRouter.route("/savedCompany").post(saveCompany).get(getSavedCompany).delete(removeSavedCompany);
// others
candidateRouter.get("/get", getAllCandidate)
candidateRouter.get("/recommended", getRecommendedJobs);

candidateRouter.route("/upload").post(uploadResumeToS3).patch(addResume)
candidateRouter.route("/uploadProfile").post(uploadProfileToS3).patch(updateProfileAvatar)
candidateRouter.route("/download").post(downloadResumeFromS3)
candidateRouter.route("/delete").delete(deleteResumeFromS3)
candidateRouter.post("/populate", populateCandidate)
candidateRouter.patch("/update/:id", updateCurrCandidate)
candidateRouter.patch("/updateNoti/:id", updateNotification)
candidateRouter.patch("/updateEdu/:id", updateEducation)
candidateRouter.patch("/updateExp/:id", updateExperience)
candidateRouter.get("/:id", isAuthenticatedEmployer, getDetails);
candidateRouter.get("/profileViews/:id/:viewby",getCandidateProfileViews);
candidateRouter.get("/totalProfileViews/:id",getTotalCandidateProfileViews);
candidateRouter.get("/itemsbyjoiningdate/:viewby",getCandidateByJoiningDate);


export default candidateRouter;