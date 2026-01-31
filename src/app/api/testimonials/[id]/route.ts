import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import Space from "@/models/Space";
import redis from "@/lib/redis";

async function getTestimonialWithAuth(id: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;

    await connectDB();
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) return null;

    // Verify ownership of the space
    // @ts-ignore
    const space = await Space.findOne({ _id: testimonial.spaceId, ownerId: session.user.id });
    if (!space) return null;

    return { testimonial, spaceId: space._id.toString() };
}

export async function PATCH(req: Request, { params }: { params: any }) {
    const { id } = await params;
    const { isApproved, isArchived, displaySettings } = await req.json();

    const result = await getTestimonialWithAuth(id);
    if (!result) {
        return NextResponse.json({ message: "Unauthorized or not found" }, { status: 401 });
    }

    const { testimonial, spaceId } = result;

    if (isApproved !== undefined) testimonial.isApproved = isApproved;
    if (isArchived !== undefined) testimonial.isArchived = isArchived;
    if (displaySettings !== undefined) {
        testimonial.displaySettings = {
            ...testimonial.displaySettings,
            ...displaySettings
        };
    }

    await testimonial.save();

    // Invalidate Redis cache
    await redis.del(`embed:${spaceId}`);

    return NextResponse.json({ testimonial });
}

export async function DELETE(req: Request, { params }: { params: any }) {
    const { id } = await params;

    const result = await getTestimonialWithAuth(id);
    if (!result) {
        return NextResponse.json({ message: "Unauthorized or not found" }, { status: 401 });
    }

    const { spaceId } = result;
    await Testimonial.findByIdAndDelete(id);

    // Invalidate Redis cache
    await redis.del(`embed:${spaceId}`);

    return NextResponse.json({ message: "Deleted" });
}
