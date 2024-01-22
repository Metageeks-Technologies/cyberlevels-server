import catchAsyncError from '../../middleware/catchAsyncError.js';
import CandidateSkills from '../../model/controlledField/candidateSkills.js';
import ErrorHandler from '../../utils/errorHandler.js';

export const getAutoComplete = (model: any) => {
    return catchAsyncError(async (req, res, next) => {
        const result = await model.aggregate([
            
            {
                "$search": {

                    "autocomplete": {
                        "query": `${req.query.query}`,
                        "path": "name",
                        "fuzzy": {
                            "maxEdits": 2,
                            "prefixLength": 3
                        }
                    }
                }
            },
            {
                "$match": {
                    "$or": [
                        { "createdBy": `${req.query.employerId}` },
                        { "createdBy": { "$exists": false } }
                    ]
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": 1 // Include the 'name' field in the result
                }
            }

        ]).exec(); // Use exec() to execute the aggregation
        console.log(result,"Query:",req.query)
        res.send(result);

    })
}

export const addSkill = catchAsyncError(async (req, res, next) => {

    const { skillName } = req.body;
    if (!skillName) {
        return next(new ErrorHandler("skill is required", 400));
    }
    const skill = skillName.toLowerCase().trim();
    const existingSkill = await CandidateSkills.findOne({ name: skill });
    if (existingSkill) {
        return next(new ErrorHandler("skill already exists, please select from the list", 400));
    }
    const newSkill = await CandidateSkills.create({ name: skill });
    res.status(200).json({
        success: true,
        skill: newSkill
    })
})

const cybersecuritySkills = [
    "Information Security",
    "Network Security",
    "Security Analysis",
    "Penetration Testing",
    "Vulnerability Assessment",
    "Security Auditing",
    "Incident Response",
    "Firewall Administration",
    "Intrusion Detection",
    "Cryptography",
    "Computer Forensics",
    "Malware Analysis",
    "Risk Management",
    "Secure Software Development",
    "Cloud Security",
    "Identity and Access Management",
    "Data Privacy",
    "Ethical Hacking",
    "Security Architecture",
    "Disaster Recovery"
];
// write a controller add this array in the CandidateSkills model
export const addSkills = catchAsyncError(async (req, res, next) => {
    for (const skill of cybersecuritySkills) {
        await CandidateSkills.create({ name: skill });
    }
    res.status(200).json({
        success: true,
    })
}
)
// export const getJobPosts = catchAsyncError(async (req, res, next) => {


//     // const jobs = await JobPost.find();
//     async function saveJobPositions() {
//         try {


//             for (const jobName of jobPositions) {
//                 const job = new JobPosition({ name: jobName });
//                 await job.save();
//                 console.log(`Saved job: ${jobName}`);
//             }

//             console.log('All job positions saved to the database.');
//         } catch (error) {
//             console.error('Error saving job positions:', error);
//         }
//     }

//     // Call the function to save the job positions
//     saveJobPositions();



//     res.status(200).json({
//         jobs,
//         success: true,


//     })
// })


