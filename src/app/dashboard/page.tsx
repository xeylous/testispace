import Link from "next/link";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Space from "@/models/Space";
import Testimonial from "@/models/Testimonial";
import SpaceCard from "@/components/SpaceCard";

async function getSpaces() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return [];

  await connectDB();
  // @ts-ignore
  const spaces = await Space.find({ ownerId: session.user.id }).sort({ createdAt: -1 });
  
  // Get testimonial counts for each space
  const spacesWithCounts = await Promise.all(
    spaces.map(async (space: any) => {
      const count = await Testimonial.countDocuments({ spaceId: space._id });
      return {
        _id: space._id.toString(),
        name: space.name,
        slug: space.slug,
        testimonialCount: count,
      };
    })
  );
  
  return spacesWithCounts;
}

export default async function DashboardPage() {
  const spaces = await getSpaces();
  // Use NEXTAUTH_URL for the base, fallback to vercel URL or localhost
  const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Your Spaces</h2>
        <Link 
            href="/dashboard/new-space"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
            <Plus size={20} />
            Create Space
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces.length === 0 ? (
            <div className="glass-card p-12 rounded-xl border-dashed border-2 border-border flex flex-col items-center justify-center text-center col-span-full">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                    <Plus size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Spaces yet</h3>
                <p className="text-muted-foreground mb-6">Create your first space to start collecting testimonials.</p>
                <Link 
                    href="/dashboard/new-space"
                    className="text-accent hover:underline"
                >
                    Create new space &rarr;
                </Link>
            </div>
        ) : (
            spaces.map((space) => (
                <SpaceCard key={space._id} space={space} baseUrl={baseUrl} />
            ))
        )}
      </div>
    </div>
  );
}

