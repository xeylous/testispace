import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendOTP } from "@/lib/mail";
import redis from "@/lib/redis";

// ... (imports)

export async function POST(req: Request) {
    try {
        const { name, email, password, phone, isPhoneVerified } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        if (phone) {
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) {
                return NextResponse.json({ message: "Phone number already in use" }, { status: 400 });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6-digit OTP for Email
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP and temp user data in Redis for 10 minutes
        const tempUserData = {
            name,
            email,
            password: hashedPassword,
            otp,
            phone,
            isPhoneVerified: !!isPhoneVerified
        };

        await redis.set(`otp:${email}`, JSON.stringify(tempUserData), "EX", 600);

        // Send OTP email
        try {
            await sendOTP(email, otp);
            console.log(`OTP sent to ${email}: ${otp}`);
        } catch (mailError) {
            console.error("Failed to send OTP email:", mailError);
        }

        return NextResponse.json({ message: "OTP sent. Please verify your email." }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
