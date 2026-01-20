import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import redis from "@/lib/redis";

export async function GET(req: Request, { params }: { params: any }) {
    const { testimonialId } = await params;

    try {
        // Check Cache
        const cached = await redis.get(`embed:single:${testimonialId}`);
        if (cached) {
            return NextResponse.json(JSON.parse(cached), {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                }
            });
        }

        await connectDB();
        const testimonial = await Testimonial.findById(testimonialId);

        if (!testimonial || !testimonial.isApproved || testimonial.isArchived) {
            return NextResponse.json({ message: "Not found or not approved" }, { status: 404 });
        }

        // Cache for 10 minutes
        await redis.setex(`embed:single:${testimonialId}`, 600, JSON.stringify(testimonial));

        return NextResponse.json(testimonial, {
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
