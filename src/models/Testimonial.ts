import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
    spaceId: mongoose.Schema.Types.ObjectId;
    textContent?: string;
    mediaUrl?: string;
    mediaType: 'none' | 'image' | 'video';
    type: 'text' | 'video' | 'image';
    content: string; // text or url
    rating: number;
    userDetails: {
        name: string;
        email?: string;
        avatar?: string;
        designation?: string;
    };
    isApproved: boolean;
    isArchived: boolean;
    createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
    spaceId: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
    textContent: { type: String }, // NEW
    mediaUrl: { type: String },    // NEW
    mediaType: { type: String, enum: ['none', 'image', 'video'], default: 'none' }, // NEW
    type: { type: String, enum: ['text', 'video', 'image'], required: true }, // Keeping for compatibility
    content: { type: String, required: true }, // Keeping for compatibility
    rating: { type: Number, min: 1, max: 5, required: true },
    userDetails: {
        name: { type: String, required: true },
        email: { type: String, lowercase: true },
        avatar: { type: String },
        designation: { type: String },
    },
    isApproved: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

// Force model recompilation to ensure schema updates are picked up in development
if (process.env.NODE_ENV !== 'production' && mongoose.models && mongoose.models.Testimonial) {
    delete mongoose.models.Testimonial;
}

const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
