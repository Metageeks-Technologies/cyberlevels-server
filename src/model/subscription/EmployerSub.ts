import mongoose from 'mongoose';
import type { IEmployerSub } from '../../types/subscription';

const employerSubSchema = new mongoose.Schema({
    subscriptionType: {
        type: String,
        required: true
    },
    subscriptionFor: {
        type: String,
        required: true
    },

    price: [
        {
            duration: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            currency: {
                abbreviation: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                symbol: {
                    type: String,
                    required: true
                }
            }
        }
    ],

    offering: {
        isCandidateSearchLimited: {
            type: Boolean,
            required: true
        },
        jobPostLimit: {
            type: Number,
            required: true
        },
        aiTokenLimit: {
            type: Number,
            required: true
        },
        isChatApplicable: {
            type: Boolean,
            required: true
        },
        isRequestApplicable: {
            type: Boolean,
            required: true
        }
    }
});

const EmployerSub = mongoose.model<IEmployerSub>('EmployerSub', employerSubSchema);
export default EmployerSub;
