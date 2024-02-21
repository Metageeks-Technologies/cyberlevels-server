import Queue from "bull";

import { sendMailWeeklyNewsletter } from "../utils/nodemailer";
import Candidate from "../model/user/Candidate";

import { getRecommendedJobs } from "../services/getRecommendedJobs";

const weeklyEmailQueue = new Queue(
  "weeklyEmail",
  "redis://default:AVNS_124zJan9XX_c9HJwYyC@redis-2b8bb14e-cyberlevels01-7716.a.aivencloud.com:27597"
);

weeklyEmailQueue.process(async () => {
  // Get all candidates or users who need to receive the weekly email
 try {
    
     const candidates = await Candidate.find({}).select(
       "email skills softSkills firstName lastName"
     );
       if(!candidates){ 
           return ;
       }
      //  console.log(candidates);
     for (const candidate of candidates) {
       // Send the weekly email
       // await sendWeeklyEmail(candidate.email);
       const jobs = await getRecommendedJobs(candidate);
       if(jobs?.length===0 || jobs===null){
           continue; 
       }
      //  console.log(jobs);
       await sendMailWeeklyNewsletter("candidate", "Recommend Jobs", candidate.email, jobs);
     }
 } catch (error) {
    console.log(error);

 }
});

export default weeklyEmailQueue;
