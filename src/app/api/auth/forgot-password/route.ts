import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendResetPasswordEmail } from '@/lib/mail';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();
        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return NextResponse.json(
                { error: 'Email not found. Please sign up or try again.' },
                { status: 404 }
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        console.log(`Setting reset token for ${normalizedEmail}: ${resetToken}`);

        const updatedUser = await User.findOneAndUpdate(
            { email: normalizedEmail },
            {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetPasswordExpires
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'Failed to update user reset token.' },
                { status: 500 }
            );
        }

        const baseUrl = (process.env.NEXTAUTH_URL || '').replace(/\/$/, '') || 'http://localhost:3000';
        console.log(`Using base URL for reset link: ${baseUrl}`);
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

        // Log the link for development purposes
        if (process.env.NODE_ENV === 'development') {
            console.log('Reset Password Link:', resetLink);
        }

        await sendResetPasswordEmail(user.email, resetLink);

        return NextResponse.json(
            { message: 'If an account with that email exists, we have sent a password reset link.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing your request.' },
            { status: 500 }
        );
    }
}
