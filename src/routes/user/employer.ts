import express from 'express';
import { isAuthenticatedCandidate, isAuthenticatedEmployer } from '../../middleware/auth';
import { getAllEmployer, signupEmployer, loginEmployer, getCurrEmployer, addNotificationToCandidate, saveCandidate, getSavedCandidate, removeSavedCandidate, updateCurrEmployer, updateProfileAvatar, getEmployerByJoiningDate, resetPassword } from '../../controller/userController/employer';
import { uploadProfileToS3 } from '../../controller/userController/candidate';

const employerRouter = express.Router();

employerRouter.post('/auth/signup', signupEmployer)
employerRouter.post('/auth/login', loginEmployer)
employerRouter.get('/auth/:id', getCurrEmployer)
employerRouter.route('/forgetPassword').patch(isAuthenticatedEmployer,resetPassword)
employerRouter.patch('/update/:id', updateCurrEmployer)
employerRouter.get("/getAllEmployers", isAuthenticatedCandidate, getAllEmployer)
employerRouter.patch("/candidateNotification", addNotificationToCandidate)
employerRouter.route("/uploadProfile").post(uploadProfileToS3).patch(updateProfileAvatar)
// save
employerRouter.route("/updateEmployerByAdmin/:id").patch(updateCurrEmployer)
employerRouter.route("/savedCandidate").post(saveCandidate).get(getSavedCandidate).delete(removeSavedCandidate)
employerRouter.get("/itemsbyjoiningdate/:viewby",getEmployerByJoiningDate);

export default employerRouter;