import mongoose, { Schema } from 'mongoose';
import TemplateModel from '../Template';
import type { ICandidateSub } from '../../types/subscription';
import type { ISchemaTemplate } from '../Template';

const getTemplateData = async (): Promise<ISchemaTemplate | null> => {
    try {
        return await TemplateModel.findOne({ name: 'CandidateSubModel' });

    } catch (error) {
        console.error('Error retrieving template:', error);
        return null;
    }
};

// Async function to initialize dynamic schema and model
const initializeDynamicModel = async () => {
    const templateData = await getTemplateData();

    if (!templateData) {
        throw new Error('Candidate subscription Schema not found');
    }

    const candidateSub = new Schema<ICandidateSub>(templateData.properties);

    return mongoose.model<ICandidateSub>('CandidateSub', candidateSub);
};


// Export a Promise that resolves to the DynamicModel
export default initializeDynamicModel();
