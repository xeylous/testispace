import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import redis from "@/lib/redis";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: "User already verified" }, { status: 200 });
        }

        // Get OTP from Redis
        const storedOtp = await redis.get(`otp:${email}`);

        if (!storedOtp) {
            console.log("Verify error: OTP expired or not found in Redis");
            return NextResponse.json({ message: "OTP has expired or is invalid" }, { status: 400 });
        }

        if (storedOtp !== otp) {
            console.log(`Verify error: OTP mismatch. Expected ${storedOtp}, Got ${otp}`);
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }

        // Verify user
        user.isVerified = true;
        // Clean up legacy fields just in case
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Delete from Redis
        await redis.del(`otp:${email}`);

        return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
