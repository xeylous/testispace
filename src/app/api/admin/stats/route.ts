import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { ISpace } from "@/models/Space";
import Space from "@/models/Space";
import Testimonial from "@/models/Testimonial";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const totalUsers = await User.countDocuments();
        const totalSpaces = await Space.countDocuments();
        const totalTestimonials = await Testimonial.countDocuments();

        // Get recent signups
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt plan");

        return NextResponse.json({
            stats: {
                totalUsers,
                totalSpaces,
                totalTestimonials
            },
            recentUsers
        });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
