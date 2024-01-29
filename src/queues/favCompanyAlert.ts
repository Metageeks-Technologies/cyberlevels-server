import Queue from 'bull';
import { getCandidatesWhoSavedCompany } from '../utils/helper';
import { sendMailForFavAlert } from '../utils/nodemailer';
import Candidate from '../model/user/Candidate';

const favCompanyAlertQueue = new Queue('favCompanyAlert', 'redis://default:AVNS_124zJan9XX_c9HJwYyC@redis-2b8bb14e-cyberlevels01-7716.a.aivencloud.com:27597');


favCompanyAlertQueue.process(async (job) => {

    const { companyId, jobTitle, jobDescription, employerId, jobId } = job.data;

    const { candidates, companyName } = await getCandidatesWhoSavedCompany(companyId);

    if (!candidates) {
        return;
    }
    for (const candidate of candidates) {
        const notification = {
            sender: employerId,
            message: `A new job ${jobTitle} has been posted by ${companyName}`,
            redirectUrl: `/job-details-v1/${jobId}`
        };

        // Add the notification to the recipient's user document
        const candidateFromDb = await Candidate.findByIdAndUpdate(candidate, {
            $push: { notifications: notification },
        }, { new: true });

        await sendMailForFavAlert(candidateFromDb?.email || "", 'favCompanyJobSubmission', { companyName, jobTitle, jobDescription });

    }
});
export default favCompanyAlertQueue;
