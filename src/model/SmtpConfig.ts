import mongoose, { Document, Schema, model } from 'mongoose';

export interface SmtpConfig extends Document {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

const smtpConfigSchema = new Schema<SmtpConfig>({
  host: { type: String, required: true },
  port: { type: Number, required: true },
  secure: { type: Boolean, required: true },
  user: { type: String, required: true },
  pass: { type: String, required: true },
});

const SmtpConfigModel = model<SmtpConfig>('SmtpConfig', smtpConfigSchema);

export default SmtpConfigModel;
