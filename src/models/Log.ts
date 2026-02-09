import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
    action: string;
    user?: mongoose.Types.ObjectId;
    details?: any;
    ip?: string;
    createdAt: Date;
}

const LogSchema = new Schema<ILog>({
    action: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    details: { type: Schema.Types.Mixed },
    ip: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);
