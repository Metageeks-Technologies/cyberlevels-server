import JobApp from "../model/JobApp";
import JobPost from "../model/JobPost";
import { ICandidate, IEmployer } from "../types/user";
import { calculateMatchScore } from "../utils/helper";

export const getRecommendedJobs = async (candidate: ICandidate) => {
  // console.log(candidate);
  try {
    const relevantJobs = await JobPost.find({
      $or: [
        { primarySkills: { $in: candidate.skills } },
        { secondarySkills: { $in: candidate.skills } },
      ],
    })
    .sort({ createdAt: -1 })
    .populate({
      path: "companyId",
      select: "logo",
    }).select("title companyId primarySkills secondarySkills jobCode").limit(6);
    

    const totalPerRequired = 60;
    // relevantJobs.map((jobs)=>
    //  console.log( jobs.primarySkills,"hello")
    
    //   )
    
    const jobRecommendations = relevantJobs.map((job) => ({
      job: job,
      score: Math.floor(
         calculateMatchScore(
          candidate.skills,
          job.primarySkills,
          job.secondarySkills
        )
      ),
    }));
    // console.log(jobRecommendations);

    const sortedRecommendations = jobRecommendations.sort(
      (a, b) => b.score - a.score
    );
    const filteredRecommendations = sortedRecommendations.filter(
      (job) => job.score > totalPerRequired
    );
    return filteredRecommendations;
  } catch (err) {
    console.error("Error fetching SMTP configuration from the database:", err);
    return null;
  }
};


export const getRecommendedCandidates = async (employer: IEmployer) => {
  try {
    // Get the last five job ids posted by the employer
    const lastFiveJobIds = await JobPost.find({ employerId: employer._id })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .limit(5) // Limit to the last five jobs
      .select("_id");

    // Get all candidates who have applied to any of the last five jobs and populate their details
    const candidates = await JobApp.find({ jobPost: { $in: lastFiveJobIds } })
      .populate("candidate")
      .limit(4)
      .exec();

    const uniqueCandidates = [...new Set(candidates.map((jobApp) => jobApp.candidate))];
    return uniqueCandidates;
  } catch (error) {
    console.error("Error fetching recommended candidates:", error);
    return null;
  }
};


