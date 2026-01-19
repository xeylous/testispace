import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
    spaceId: mongoose.Schema.Types.ObjectId;
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
    type: { type: String, enum: ['text', 'video', 'image'], required: true },
    content: { type: String, required: true },
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

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
