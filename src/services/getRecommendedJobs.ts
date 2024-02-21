import JobPost from "../model/JobPost";
import { ICandidate } from "../types/user";
import { calculateMatchScore } from "../utils/helper";

export const getRecommendedJobs = async (candidate: ICandidate) => {
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
      }).select("title companyId").limit(6);

    const totalPerRequired = 60;
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
