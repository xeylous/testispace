import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
    spaceId: mongoose.Schema.Types.ObjectId;
    date: Date;
    views: number;
    clicks: number;
}

const AnalyticsSchema = new Schema<IAnalytics>({
    spaceId: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
    date: { type: Date, required: true },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
});

// Compound index for efficient querying by space and date
AnalyticsSchema.index({ spaceId: 1, date: 1 }, { unique: true });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
