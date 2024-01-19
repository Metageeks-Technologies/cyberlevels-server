// import { NextApiRequest, NextApiResponse } from 'next';
// import CandidateModel from '../model/user/Candidate'; // Adjust the path accordingly

// export default async function handleBackup(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const candidates = await CandidateModel.find({}, '-password'); // Exclude the password field

//     const backupData = {
//       candidates,
//     };

//     // You can save backupData to a file, send it via email, etc.
//     // For simplicity, we'll return it as JSON in this example.
//     res.status(200).json(backupData);
//   } catch (error) {
//     console.error('Error during backup:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

// controllers/backupController.ts
// import { NextApiRequest, NextApiResponse } from 'next';
import catchAsyncError from '../middleware/catchAsyncError';
import CandidateModel from '../model/user/Candidate'; // Adjust the path accordingly
import EmployerModel from '../model/user/Employer'; // Adjust the path accordingly
import Company from "../model/Company"; // Adjust the path accordingly
import EmailTemplateModel from '../model/EmailTemplate';
import JobPost from '../model/JobPost';
import ErrorHandler from "../utils/errorHandler";
import { stringify } from 'circular-json';

export const backupData = catchAsyncError(async (req, res ,next) =>{
  try {

    const candidates = await CandidateModel.find({}, '-password'); // Exclude the password field
    const employer = await EmployerModel.find({}, '-password');
    const company= await Company.find();
    const emailTemplate = EmailTemplateModel.find();
    const jobPost = JobPost.find();

    const backupData = {
      candidates,
      employer,
      company,
    //   emailTemplate,
    //   jobPost,
    
    //   name: 'John Doe',
    //   email: 'john@example.com',
    };

    // You can save backupData to a file, send it via email, etc.
    // For simplicity, we'll return it as JSON in this example.
    // const jsonData = stringify(backupData);
    res.status(200).json(backupData);
  } catch (error) {
    console.error('Error during backup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})