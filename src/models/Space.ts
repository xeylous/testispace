import mongoose, { Schema, Document } from 'mongoose';

export interface ISpace extends Document {
    ownerId: mongoose.Schema.Types.ObjectId;
    name: string;
    slug: string;
    logo?: string;
    headerTitle: string;
    customMessage: string;
    brandColor: string;
    questions: string[];
    status: 'active' | 'archived';
    createdAt: Date;
}

const SpaceSchema = new Schema<ISpace>({
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logo: { type: String },
    headerTitle: { type: String, default: 'Share your experience' },
    customMessage: { type: String, default: 'We would love to hear from you!' },
    brandColor: { type: String, default: '#8b5cf6' },
    questions: { type: [String], default: ['What did you like the most?', 'How did it help you?'] },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Space || mongoose.model<ISpace>('Space', SpaceSchema);
