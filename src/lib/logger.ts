import connectDB from "@/lib/db";
import Log from "@/models/Log";
import { headers } from "next/headers";

export async function logActivity(
    action: string,
    userId?: string | null,
    details?: any
) {
    try {
        await connectDB();

        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || "unknown";

        await Log.create({
            action,
            user: userId || null,
            details,
            ip
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
        // Don't throw error to prevent blocking main flow
    }
}
