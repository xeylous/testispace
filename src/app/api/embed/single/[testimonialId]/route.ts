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
        const t = await Testimonial.findById(testimonialId).lean();

        if (!t || !t.isApproved || t.isArchived) {
            return NextResponse.json({ message: "Not found or not approved" }, { status: 404 });
        }

        const rawMediaType = t.mediaType || t.type;
        const isMedia = rawMediaType === 'image' || rawMediaType === 'video';

        const mapped = {
            _id: t._id.toString(),
            textContent: t.textContent || (!isMedia ? t.content : ""),
            mediaUrl: t.mediaUrl || (isMedia ? t.content : ""),
            mediaType: isMedia ? rawMediaType : 'none',
            rating: t.rating || 5,
            displaySettings: t.displaySettings || {
                showExperience: true,
                showImage: true,
                showName: true,
                showDesignation: true
            },
            userDetails: {
                name: t.userDetails?.name || "Anonymous",
                designation: t.userDetails?.designation || "",
                avatar: t.userDetails?.avatar || "",
            },
            createdAt: t.createdAt
        };

        // Cache for 10 minutes
        await redis.setex(`embed:single:${testimonialId}`, 600, JSON.stringify(mapped));

        return NextResponse.json(mapped, {
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
