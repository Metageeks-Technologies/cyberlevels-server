import express from 'express';
import JobCategory from '../model/controlledField/jobCategory';
import JobPosition from '../model/controlledField/JobPosition';
import CompanyCategory from '../model/controlledField/companyCategory';
import { getAutoComplete } from '../controller/controlledField/controlledFeild.ts';
const controlledFieldRouter = express.Router();

// controlledFieldRouter.route("/companyCategory/add").post(addCompanyCategory);
// controlledFieldRouter.route("/companyCategory/delete").delete(deleteCompanyCategory);
controlledFieldRouter.route("/companyCategory/search").get(getAutoComplete(CompanyCategory));

// controlledFieldRouter.route("/jobCategory/add").post(addJobCategory);
// controlledFieldRouter.route("/jobCategory/delete").delete(deleteJobCategory);
controlledFieldRouter.route("/jobCategory/search").get(getAutoComplete(JobCategory));

// controlledFieldRouter.route("/jobTitle/add").post(addJobTitle);
// controlledFieldRouter.route("/jobTitle/delete").delete(deleteJobTitle);
controlledFieldRouter.route("/jobTitle/search").get(getAutoComplete(JobPosition));



export default controlledFieldRouter;
