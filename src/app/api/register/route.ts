import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendOTP } from "@/lib/mail";
import redis from "@/lib/redis";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            provider: "credentials",
            isVerified: false
        });

        // Store OTP in Redis for 10 minutes
        await redis.set(`otp:${email}`, otp, "EX", 600);

        // Send OTP email
        // We don't await this to speed up response, or we can await to ensure it sent
        try {
            await sendOTP(email, otp);
            console.log(`OTP sent to ${email}: ${otp}`); // For dev/debugging
        } catch (mailError) {
            console.error("Failed to send OTP email:", mailError);
            // Optionally delete user if email fails
            // await User.deleteOne({ _id: user._id });
            // return NextResponse.json({ message: "Failed to send verification email" }, { status: 500 });
        }

        return NextResponse.json({ message: "User registered. Please verify your email.", userId: user._id }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
