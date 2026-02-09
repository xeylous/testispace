import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    image?: string;
    password?: string;
    provider: string;
    isVerified: boolean;
    role: 'user' | 'admin';
    plan: 'free' | 'pro' | 'business';
    phone?: string;
    isPhoneVerified?: boolean;
    otp?: string;
    otpExpires?: Date;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String },
    password: { type: String, select: false },
    provider: { type: String, default: 'email' },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    plan: { type: String, enum: ['free', 'pro', 'business'], default: 'free' },
    phone: { type: String, unique: true, sparse: true },
    isPhoneVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
