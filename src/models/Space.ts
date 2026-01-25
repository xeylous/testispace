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

    // Embed customization fields
    embedLayout: 'grid' | 'carousel' | 'masonry' | 'list';
    cardStyle: 'modern' | 'minimal' | 'classic' | 'gradient';
    customStyles: {
        backgroundColor?: string;
        textColor?: string;
        accentColor?: string;
        fontFamily?: string;
        borderRadius?: string;
    };
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

    // Embed customization
    embedLayout: { type: String, enum: ['grid', 'carousel', 'masonry', 'list'], default: 'grid' },
    cardStyle: { type: String, enum: ['modern', 'minimal', 'classic', 'gradient'], default: 'modern' },
    customStyles: { type: Schema.Types.Mixed, default: {} }
});

export default mongoose.models.Space || mongoose.model<ISpace>('Space', SpaceSchema);
