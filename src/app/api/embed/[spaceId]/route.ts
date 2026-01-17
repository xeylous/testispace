import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import redis from "@/lib/redis";

export async function GET(req: Request, { params }: { params: any }) {
    const { spaceId } = await params;

    try {
        // Check Cache
        const cached = await redis.get(`embed:${spaceId}`);
        if (cached) {
            return NextResponse.json(JSON.parse(cached), {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                }
            });
        }

        await connectDB();
        const testimonials = await Testimonial.find({
            spaceId,
            isApproved: true,
            isArchived: false
        }).sort({ createdAt: -1 });

        // Cache for 5 minutes
        await redis.setex(`embed:${spaceId}`, 300, JSON.stringify(testimonials));

        return NextResponse.json(testimonials, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
            }
        });

    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
        }
    });
}
