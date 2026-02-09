import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            // New Feature: List all users to help debugging
            const allUsers = await User.find().select('name email role');
            return NextResponse.json({
                error: "Email is required. Here are the registered users:",
                users: allUsers
            }, { status: 400 });
        }

        await connectDB();

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { role: "admin" },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `User ${user.email} is now an admin!`,
            user: { name: user.name, email: user.email, role: user.role, provider: user.provider }
        });

    } catch (error) {
        console.error("Error setting admin:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
