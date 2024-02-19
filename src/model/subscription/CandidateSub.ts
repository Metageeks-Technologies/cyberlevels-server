import mongoose from 'mongoose';
import type { ICandidateSub } from '../../types/subscription';

const candidateSubSchema = new mongoose.Schema({
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
        isFeedBackLimit: {
            type: Boolean,
            required: true
        },
        jobApplicationLimit: {
            type: Number,
            required: true
        },
        aiTokenLimit: {
            type: Number,
            required: true
        },
        isSaveApplicable: {
            type: Boolean,
            required: true
        },
        isFullCompanyView: {
            type: Boolean,
            required: true
        }
    }
});

const CandidateSub = mongoose.model<ICandidateSub>('CandidateSub', candidateSubSchema);
export default CandidateSub;