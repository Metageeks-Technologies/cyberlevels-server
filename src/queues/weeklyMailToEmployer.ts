import Queue from "bull";

import { sendMailWeeklyEmployer } from "../utils/nodemailer";
import Candidate from "../model/user/Candidate";

import { getRecommendedCandidates, getRecommendedJobs } from "../services/getRecommendedJobs";
import Employer from "../model/user/Employer";

const weeklyEmailQueueForEmployer = new Queue(
  "weeklyEmailForEmployer",
  "redis://default:AVNS_124zJan9XX_c9HJwYyC@redis-2b8bb14e-cyberlevels01-7716.a.aivencloud.com:27597"
);

weeklyEmailQueueForEmployer.process(async () => {
  // Get all candidates or users who need to receive the weekly email
  try {

    const employers = await Employer.find({}).select(
      "email jobs"
    );
    employers.forEach((employer) => {
        employer.jobs = employer.jobs.reverse();
      });
    if (!employers) {
      return;
    }
    //  console.log(candidates);
    for (const employer of employers) {
      // Send the weekly email
      // await sendWeeklyEmail(candidate.email);
      const candidates = await getRecommendedCandidates(employer);
    //   if (jobs?.length === 0 || jobs === null) {
    //     continue;
    //   }
    if(candidates?.length===0 || candidates === null){
        continue;
    }
       console.log(candidates);
      await sendMailWeeklyEmployer("employer", "Recommend Candidates", employer.email, candidates);
    }
  } catch (error) {
    console.log(error);

  }
});

export default weeklyEmailQueueForEmployer;
