import express from 'express';
import passport from '../../utils/passportConfig'
import {
    getUserLinkedIn,
    getAllCandidate, saveJob,
    logoutCandidate, signupCandidate,
    loginCandidate, updateCurrCandidate, updateEducation, updateExperience, populateCandidate, getDetails, getCurrCandidate, getSaveJob, removeSavedJob, saveCompany, getSavedCompany, removeSavedCompany, updateNotification, uploadResumeToS3, addResume, downloadResumeFromS3, getRecommendedJobs, deleteResumeFromS3, uploadProfileToS3, updateProfileAvatar, getCandidateProfileViews, getTotalCandidateProfileViews, getCandidateByJoiningDate, getUserGoogle, updateExistingEducation, updateExistingExperience, updateCandidateByAdmin
} from '../../controller/userController/candidate'
import { isAuthenticatedCandidate, isAuthenticatedEmployer } from '../../middleware/auth';
import profileComplete from '../../middleware/profileComplete';

const candidateRouter = express.Router();
// auth 
candidateRouter.get('/auth/google', passport.authenticate('google', { state: '12345678' }));
candidateRouter.get('/auth/google/callback', passport.authenticate('google', { successRedirect: "/", failureRedirect: "/login" }))
candidateRouter.post('/auth/getCandidateGoogle', getUserGoogle);
candidateRouter.get('/auth/linkedin', passport.authenticate('linkedin', { state: '12345678' }));
candidateRouter.get('/auth/linkedin/callback', passport.authenticate('linkedin', { successRedirect: "/", failureRedirect: "/login" }));
candidateRouter.post('/auth/getCandidate', getUserLinkedIn)
candidateRouter.post('/auth/signup', signupCandidate)
candidateRouter.post('/auth/login', loginCandidate);
candidateRouter.get('/auth/:id', isAuthenticatedCandidate, getCurrCandidate);
candidateRouter.get('/logout', logoutCandidate)
// saveJob
candidateRouter.route("/savedJob").post(saveJob).get(getSaveJob).delete(removeSavedJob);
// saveCompany
candidateRouter.route("/savedCompany").post(saveCompany).get(getSavedCompany).delete(removeSavedCompany);
// others
candidateRouter.get("/get", getAllCandidate)
candidateRouter.get("/recommended", getRecommendedJobs);
candidateRouter.route("/deleteByAdmin/:id").patch(updateCandidateByAdmin)

candidateRouter.route("/upload").post(uploadResumeToS3).patch(isAuthenticatedCandidate, profileComplete, addResume)
candidateRouter.route("/uploadProfile").post(uploadProfileToS3).patch(isAuthenticatedCandidate, profileComplete, updateProfileAvatar)
candidateRouter.route("/download").post(downloadResumeFromS3)
candidateRouter.route("/delete").delete(deleteResumeFromS3)
candidateRouter.post("/populate", populateCandidate)
candidateRouter.patch("/update/:id", isAuthenticatedCandidate, profileComplete, updateCurrCandidate)
candidateRouter.patch("/updateNoti/:id", updateNotification)
candidateRouter.patch("/updateEdu/:id", isAuthenticatedCandidate, profileComplete, updateEducation)
candidateRouter.patch("/updateEdu/:id/:eduId", updateExistingEducation)
candidateRouter.patch("/updateExp/:id", isAuthenticatedCandidate, profileComplete, updateExperience)
candidateRouter.patch("/updateExp/:id/:expId", updateExistingExperience)
candidateRouter.get("/:id", isAuthenticatedEmployer, getDetails);
candidateRouter.get("/profileViews/:id/:viewby", getCandidateProfileViews);
candidateRouter.get("/totalProfileViews/:id", getTotalCandidateProfileViews);
candidateRouter.get("/itemsbyjoiningdate/:viewby", getCandidateByJoiningDate);


export default candidateRouter;