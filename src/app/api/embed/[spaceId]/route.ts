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
        const space = await Space.findById(spaceId).select('name embedLayout cardStyle customStyles selectedTestimonials');

        if (!space) {
            return NextResponse.json({ message: "Space not found" }, { status: 404 });
        }

        const query: any = {
            spaceId,
            isApproved: true,
            isArchived: false
        };

        if (space.selectedTestimonials && space.selectedTestimonials.length > 0) {
            query._id = { $in: space.selectedTestimonials };
        }

        const testimonials = await Testimonial.find(query).sort({ createdAt: -1 }).lean();

        // Standardized mapping logic for widgets
        const mappedTestimonials = testimonials.map((t: any) => {
            const rawMediaType = t.mediaType || t.type;
            const isMedia = rawMediaType === 'image' || rawMediaType === 'video';

            return {
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
        });

        const data = {
            space: {
                name: space.name,
                embedLayout: space.embedLayout,
                cardStyle: space.cardStyle,
                customStyles: space.customStyles
            },
            testimonials: mappedTestimonials,
            config: {
                pusherKey: process.env.NEXT_PUBLIC_PUSHER_KEY,
                pusherCluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
            }
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
