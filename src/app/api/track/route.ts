import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Analytics from "@/models/Analytics";

export async function POST(req: Request) {
    try {
        const { spaceId, event } = await req.json();

        if (!spaceId || !['view', 'click'].includes(event)) {
            return NextResponse.json({ message: "Invalid data" }, { status: 400 });
        }

        await connectDB();

        // Normalize date to start of day (UTC)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const update = event === 'view' ? { $inc: { views: 1 } } : { $inc: { clicks: 1 } };

        await Analytics.findOneAndUpdate(
            { spaceId, date: today },
            update,
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Tracking Error:", error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}
