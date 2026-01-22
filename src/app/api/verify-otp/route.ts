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

        // Check if user already exists (double check in case race condition or retry)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already registered" }, { status: 400 });
        }

        // Get temp data from Redis
        const tempUserDataString = await redis.get(`otp:${email}`);

        if (!tempUserDataString) {
            console.log("Verify error: OTP expired or not found in Redis");
            return NextResponse.json({ message: "OTP has expired or is invalid" }, { status: 400 });
        }

        const tempUserData = JSON.parse(tempUserDataString);

        if (tempUserData.otp !== otp) {
            console.log(`Verify error: OTP mismatch. Expected ${tempUserData.otp}, Got ${otp}`);
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }

        // Create user from temp data
        const newUser = await User.create({
            name: tempUserData.name,
            email: tempUserData.email,
            password: tempUserData.password,
            provider: "credentials",
            isVerified: true
        });

        // Delete from Redis
        await redis.del(`otp:${email}`);

        return NextResponse.json({ message: "Email verified successfully", userId: newUser._id }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
