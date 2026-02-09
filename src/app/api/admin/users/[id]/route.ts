import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { logActivity } from "@/lib/logger";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { plan, role } = await req.json();

        await connectDB();

        const updateData: any = {};
        if (plan) updateData.plan = plan;
        if (role) updateData.role = role;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Log the action
        await logActivity(
            "USER_UPDATE",
            session.user.id,
            {
                targetUser: updatedUser.email,
                updates: updateData,
                admin: session.user.email
            }
        );

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
