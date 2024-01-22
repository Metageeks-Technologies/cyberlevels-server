import mongoose,{ Document, Schema, model } from 'mongoose';

export interface Template extends Document {
  id: string;
  templateType: string;
  templateName: string;
  subject: string;
  body: string;
  beingUsedFor:string | undefined;
}

const emailTemplateSchema = new Schema<Template>({
  id:{type:String,required:true},
  templateType: {type:String,requires:true},
  templateName: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  beingUsedFor:String,
});

const EmailTemplateModel = mongoose.model<Template>('EmailTemplate', emailTemplateSchema);
export default EmailTemplateModel;