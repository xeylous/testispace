
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { pusherServer } from "@/lib/pusher";
import redis from "@/lib/redis";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { ids, action, value } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
        }

        await connectDB();

        let updateData = {};
        if (action === "approve") {
            updateData = { isApproved: value };
        } else if (action === "archive") {
            updateData = { isArchived: value };
        }

        const result = await Testimonial.updateMany(
            { _id: { $in: ids } },
            { $set: updateData }
        );

        // Fetch one testimonial to get the spaceId
        const testimonial = await Testimonial.findOne({ _id: ids[0] }).select('spaceId');

        if (testimonial && testimonial.spaceId) {
            const spaceId = testimonial.spaceId.toString();

            // Invalidate Cache
            await redis.del(`embed_v2:${spaceId}`);

            await pusherServer.trigger(`space-${spaceId}`, 'update', {
                type: 'testimonials-updated',
                ids,
                action,
                value
            });
        }

        return NextResponse.json({ message: "Success", matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error("Batch update error:", error);
        return NextResponse.json({ message: "Error updating testimonials" }, { status: 500 });
    }
}
