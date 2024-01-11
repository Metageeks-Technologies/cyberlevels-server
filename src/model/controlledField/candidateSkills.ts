import mongoose, { Schema, Document, Model } from 'mongoose';

interface ISkill extends Document {
    name: string;
}

const candidateSkills: Schema<ISkill> = new Schema({
    name: { type: String, required: true },
});

const CandidateSkills = mongoose.model<ISkill>('candidateSkills', candidateSkills);

export default CandidateSkills;

