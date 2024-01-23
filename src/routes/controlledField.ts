import express from 'express';
import JobCategory from '../model/controlledField/jobCategory';
import JobPosition from '../model/controlledField/JobPosition';
import CompanyCategory from '../model/controlledField/companyCategory';
import { addPosition, addSkill, getAutoComplete, getAutoCompleteCategory, addJobCategory } from '../controller/controlledField/controlledFeild.ts';
import Company from '../model/Company';
import CandidateSkills from '../model/controlledField/candidateSkills';
const controlledFieldRouter = express.Router();

// controlledFieldRouter.route("/companyCategory/add").post(addCompanyCategory);
// controlledFieldRouter.route("/companyCategory/delete").delete(deleteCompanyCategory);
controlledFieldRouter.route("/companyCategory/search").get(getAutoComplete(CompanyCategory));

// controlledFieldRouter.route("/jobCategory/add").post(addJobCategory);
// controlledFieldRouter.route("/jobCategory/delete").delete(deleteJobCategory);
controlledFieldRouter.route("/jobCategory/search").get(getAutoCompleteCategory);
controlledFieldRouter.route("/jobCategory/add").post(addJobCategory);

// controlledFieldRouter.route("/jobTitle/add").post(addJobTitle);
// controlledFieldRouter.route("/jobTitle/delete").delete(deleteJobTitle);
controlledFieldRouter.route("/jobTitle/search").get(getAutoComplete(JobPosition));
controlledFieldRouter.route("/jobTitle/add").post(addPosition);

controlledFieldRouter.route("/companyName/search").get(getAutoComplete(Company));
// controlledFieldRouter.route("/candidateSkills/populate").post(addSkills);
controlledFieldRouter.route("/candidateSkills/search").get(getAutoComplete(CandidateSkills));
controlledFieldRouter.route("/candidateSkills/add").post(addSkill);





export default controlledFieldRouter;
