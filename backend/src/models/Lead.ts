import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  budgetRange: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: Date;
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  budgetRange: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' }
}, {
  timestamps: true
});

export default mongoose.model<ILead>('Lead', LeadSchema);
