import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import Space from "@/models/Space";
import redis from "@/lib/redis";

export async function GET(req: Request, { params }: { params: any }) {
    const { spaceId } = await params;

    try {
        // Check Cache
        const cached = await redis.get(`embed_v2:${spaceId}`);
        if (cached) {
            return NextResponse.json(JSON.parse(cached), {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                }
            });
        }

        await connectDB();
        const [space, testimonials] = await Promise.all([
            Space.findById(spaceId).select('name embedLayout cardStyle customStyles'),
            Testimonial.find({
                spaceId,
                isApproved: true,
                isArchived: false
            }).sort({ createdAt: -1 })
        ]);

        if (!space) {
            return NextResponse.json({ message: "Space not found" }, { status: 404 });
        }

        const data = {
            space: {
                name: space.name,
                embedLayout: space.embedLayout,
                cardStyle: space.cardStyle,
                customStyles: space.customStyles
            },
            testimonials
        };

        // Cache for 5 minutes
        await redis.set(`embed_v2:${spaceId}`, JSON.stringify(data), 'EX', 300);

        return NextResponse.json(data, {
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
