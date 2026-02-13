import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { token: rawToken, password } = await req.json();
        const token = rawToken?.trim();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required.' },
                { status: 400 }
            );
        }

        console.log('Attempting password reset with token:', token);
        const currentTime = new Date();
        console.log('Current server time:', currentTime.toISOString());

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: currentTime }
        }).select('+resetPasswordToken +resetPasswordExpires');

        console.log('User found for reset:', user ? 'Yes' : 'No');

        if (user) {
            console.log('Token in DB:', user.resetPasswordToken);
            console.log('Token expires in DB:', user.resetPasswordExpires?.toISOString());
        } else {
            // Check if user exists with token but expired
            const expiredUser = await User.findOne({ resetPasswordToken: token }).select('+resetPasswordToken +resetPasswordExpires');
            if (expiredUser) {
                console.log('User found but token EXPIRED. Expiration:', expiredUser.resetPasswordExpires?.toISOString());
            } else {
                console.log('No user found with this reset token at all.');
            }
        }

        if (!user) {
            return NextResponse.json(
                { error: 'Password reset token is invalid or has expired.' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return NextResponse.json(
            { message: 'Password has been reset successfully.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'An error occurred while resetting your password.' },
            { status: 500 }
        );
    }
}
